import { ApiError } from '../utils/apiError.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateRandomToken
} from '../utils/token.js';
import { User } from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';
import {
  storeRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens
} from './token.service.js';
import { sendPasswordResetLink } from './mail.service.js';
import { verifyGoogleToken } from "./google.service.js";

function createTokenPayload(user) {
  return {
    sub: user._id,
    name: user.name,
    role: user.role,
    campus: user.campus
  };
}
export async function registerStudent(payload) {
  const existingUser = await User.findOne({
  $or: [
    { studentId: payload.studentId },
    { collegeEmail: payload.collegeEmail?.toLowerCase() },
    { personalEmail: payload.personalEmail.toLowerCase() }
  ]
});

if (existingUser) {
  if (
    existingUser.personalEmail === payload.personalEmail.toLowerCase()
  ) {
    throw new ApiError(409, "Personal email already exists");
  }

  if (
    existingUser.collegeEmail === payload.collegeEmail?.toLowerCase()
  ) {
    throw new ApiError(409, "College email already exists");
  }

  if (existingUser.studentId === payload.studentId) {
    throw new ApiError(409, "Student ID already exists");
  }
}

  return User.create({
    ...payload,
    role: ROLES.STUDENT,
    approved: true
  });
}



export async function login({ loginId, password }, meta = {}) {
  const user = await User.findOne({
    $or: [
      { collegeEmail: loginId.toLowerCase() },
      { personalEmail: loginId.toLowerCase() }
    ]
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Google account without a password
  if (!user.password) {
    throw new ApiError(
      400,
      "This account doesn't have a password yet. Please sign in with Google."
    );
  }

  const matched = await user.comparePassword(password);

  if (!matched) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (
    user.role === ROLES.CAMPUS_COORDINATOR &&
    !user.approved
  ) {
    throw new ApiError(
      403,
      "Coordinator account is awaiting approval"
    );
  }

  const tokenPayload = createTokenPayload(user);

const accessToken = signAccessToken(tokenPayload);

const refreshToken = signRefreshToken(tokenPayload);

  await storeRefreshToken(user, refreshToken, meta);

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken
  };
}

export async function refresh(refreshToken) {
  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.sub).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const tokenHash = hashToken(refreshToken);

  const exists = user.refreshTokens.some(
    token => token.tokenHash === tokenHash
  );

  if (!exists) {
    throw new ApiError(401, 'Refresh token revoked');
  }

 const tokenPayload = createTokenPayload(user);

const newAccessToken = signAccessToken(tokenPayload);

const newRefreshToken = signRefreshToken(tokenPayload);

  await revokeRefreshToken(user, refreshToken);
  await storeRefreshToken(user, newRefreshToken);

  return {
    user: user.toJSON(),
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}

export async function logout(userId, refreshToken) {
  const user = await User.findById(userId).select('+password');

  if (!user) return;

  if (refreshToken) {
    await revokeRefreshToken(user, refreshToken);
  } else {
    await revokeAllRefreshTokens(user);
  }
}

export async function forgotPassword(email) {

    const user = await User.findOne({
        $or: [
            { personalEmail: email.toLowerCase() },
            { collegeEmail: email.toLowerCase() }
        ]
    });

    if (!user) return;

    const token = generateRandomToken();

    user.passwordResetToken = hashToken(token);

    user.passwordResetExpires = new Date(
        Date.now() + 60 * 60 * 1000
    );

    await user.save();

    await sendPasswordResetLink(
        user.personalEmail || user.collegeEmail,
        token
    );
}
export async function resetPassword(token, password) {
  const tokenHash = hashToken(token);

  const user = await User.findOne({
    passwordResetToken: tokenHash,
    passwordResetExpires: { $gt: new Date() }
  }).select('+password');

  if (!user) {
    throw new ApiError(400, 'Invalid or expired token');
  }

  user.password = password;
  user.passwordResetToken = '';
  user.passwordResetExpires = null;
  user.refreshTokens = [];

  await user.save();
}

export async function changePassword(
  userId,
  currentPassword,
  newPassword
) {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const matched = await user.comparePassword(currentPassword);

  if (!matched) {
    throw new ApiError(
      400,
      'Current password is incorrect'
    );
  }

  user.password = newPassword;
  user.refreshTokens = [];

  await user.save();
}
export async function updateProfile(userId, updates) {
  const allowed = ['name', 'phone', 'department', 'year', 'skills', 'profileImage', 'resume', 'collegeEmail'];
  const payload = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) payload[key] = updates[key];
  }

  const user = await User.findByIdAndUpdate(userId, payload, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}


export async function googleLogin(idToken, meta = {}) {

  const googleUser = await verifyGoogleToken(idToken);

  if (!googleUser.emailVerified) {
    throw new ApiError(
      400,
      "Google email is not verified"
    );
  }

  let user = await User.findOne({
    personalEmail: googleUser.email.toLowerCase()
  }).select("+password");

  /*
    Existing User
  */
  if (user) {

    // Link Google account if not linked already
    if (!user.googleId) {
  user.googleId = googleUser.googleId;
  await user.save();
}

    // If profile isn't complete yet
    if (!user.profileCompleted) {

      return {
        profileCompleted: false,
        user: user.toJSON()
      };

    }

    const tokenPayload = createTokenPayload(user);

const accessToken = signAccessToken(tokenPayload);

const refreshToken = signRefreshToken(tokenPayload);

    await storeRefreshToken(
      user,
      refreshToken,
      meta
    );

    return {
      profileCompleted: true,
      user: user.toJSON(),
      accessToken,
      refreshToken
    };

  }

  /*
    New User
  */

user = await User.create({
  name: googleUser.name,
  personalEmail: googleUser.email.toLowerCase(),

  googleId: googleUser.googleId,

  password: null,

  profileCompleted: false,

  approved: true
});

  return {

    profileCompleted: false,

    user: user.toJSON()

  };

}


export async function completeGoogleProfile(
  userId,
  payload,
  meta = {}
) {

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.profileCompleted) {
    throw new ApiError(
      400,
      "Profile already completed"
    );
  }

  // Check duplicates
  const existing = await User.findOne({
    _id: { $ne: user._id },
    $or: [
      { studentId: payload.studentId },
      { collegeEmail: payload.collegeEmail?.toLowerCase() }
    ]
  });

  if (existing) {
    throw new ApiError(
      409,
      "Student ID or College Email already exists"
    );
  }

  user.phone = payload.phone;
  user.studentId = payload.studentId;
  user.collegeEmail =
    payload.collegeEmail?.toLowerCase();

  user.campus = payload.campus;
  user.branch = payload.branch;
  user.yearOfStudy = payload.yearOfStudy;

  user.batchYear = payload.batchYear;
  user.passedOutYear = payload.passedOutYear;

  user.linkedinProfile =
    payload.linkedinProfile || "";

  user.githubProfile =
    payload.githubProfile || "";

  user.skills = payload.skills || [];

if (payload.password) {
  user.password = payload.password;
}

  user.role = ROLES.STUDENT;

  user.profileCompleted = true;

  await user.save();

  const tokenPayload = createTokenPayload(user);

const accessToken = signAccessToken(tokenPayload);

const refreshToken = signRefreshToken(tokenPayload);

  await storeRefreshToken(
    user,
    refreshToken,
    meta
  );

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken
  };

}