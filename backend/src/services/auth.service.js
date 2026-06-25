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
  }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const matched = await user.comparePassword(password);

  if (!matched) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (
    user.role === ROLES.CAMPUS_COORDINATOR &&
    !user.approved
  ) {
    throw new ApiError(
      403,
      'Coordinator account is awaiting approval'
    );
  }

 const tokenPayload = {
  sub: user._id,
  name: user.name,
  role: user.role,
  campus: user.campus
};

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

 const tokenPayload = {
  sub: user._id,
  name: user.name,
  role: user.role,
  campus: user.campus
};

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