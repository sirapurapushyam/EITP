import { User } from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  buildPagination,
  buildPaginationResponse
} from '../utils/pagination.js';

function buildSearchFilter(search) {
  if (!search) return {};

  return {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
      { collegeEmail: { $regex: search, $options: 'i' } },
      { personalEmail: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ]
  };
}

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort, search } = buildPagination(req.query);

  const filter = {
    ...buildSearchFilter(search)
  };

  if (req.query.role) filter.role = req.query.role;

  if (req.query.branch) filter.branch = req.query.branch;

  if (req.query.yearOfStudy) filter.yearOfStudy = req.query.yearOfStudy;

  if (req.query.placed !== undefined) {
    filter.placed = req.query.placed === 'true';
  }

  if (req.user.role === ROLES.CAMPUS_COORDINATOR) {
    filter.campus = req.user.campus;
  } else if (req.query.campus) {
    filter.campus = req.query.campus;
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter)
  ]);

  res.json({
    success: true,
    ...buildPaginationResponse(page, limit, total, users)
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Student can view only own profile
  if (
    req.user.role === ROLES.STUDENT ||
    req.user.role === ROLES.STUDENT_INTERN
  ) {
    if (String(req.user._id) !== String(user._id)) {
      throw new ApiError(403, 'Access denied');
    }
  }

  // Coordinator can view only same campus
  if (
    req.user.role === ROLES.CAMPUS_COORDINATOR &&
    req.user.campus !== user.campus
  ) {
    throw new ApiError(403, 'Access denied');
  }

  res.json({
    success: true,
    data: user
  });
});

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: user
  });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const blockedFields = [
    'role',
    'approved',
    'campus',
    'studentId',
    'collegeEmail',
    'personalEmail',
    'password',
    'refreshTokens',
    'passwordResetToken',
    'passwordResetExpires'
  ];

  blockedFields.forEach(field => delete req.body[field]);

  // Student-specific fields
  const allowedFields = [
    'name',
    'phone',
    'skills',
    'linkedinProfile',
    'githubProfile',
    'branch',
    'yearOfStudy',
    'batchYear',
    'passedOutYear',
    'designation'
  ];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

export const approveCoordinator = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role !== ROLES.CAMPUS_COORDINATOR) {
    throw new ApiError(400, 'User is not a coordinator');
  }

  user.approved = true;

  await user.save();

  res.json({
    success: true,
    message: 'Coordinator approved successfully',
    data: user
  });
});

export const promoteToIntern = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (
    req.user.role === ROLES.CAMPUS_COORDINATOR &&
    req.user.campus !== user.campus
  ) {
    throw new ApiError(403, 'Access denied');
  }

  if (user.role !== ROLES.STUDENT) {
    throw new ApiError(400, 'Only students can be promoted');
  }

  user.role = ROLES.STUDENT_INTERN;

  await user.save();

  res.json({
    success: true,
    message: 'Student promoted to intern',
    data: user
  });
});

export const removeInternRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (
    req.user.role === ROLES.CAMPUS_COORDINATOR &&
    req.user.campus !== user.campus
  ) {
    throw new ApiError(403, 'Access denied');
  }

  if (user.role !== ROLES.STUDENT_INTERN) {
    throw new ApiError(400, 'User is not an intern');
  }

  user.role = ROLES.STUDENT;

  await user.save();

  res.json({
    success: true,
    message: 'Intern role removed successfully',
    data: user
  });
});

export const listStudents = asyncHandler(async (req, res) => {
  req.query.role = ROLES.STUDENT;
  return listUsers(req, res);
});

export const listInterns = asyncHandler(async (req, res) => {
  req.query.role = ROLES.STUDENT_INTERN;
  return listUsers(req, res);
});

export const listCoordinators = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.DEAN_EITP) {
    throw new ApiError(403, 'Only dean can access coordinators');
  }

  req.query.role = ROLES.CAMPUS_COORDINATOR;

  return listUsers(req, res);
});

export const getUserStats = asyncHandler(async (_req, res) => {
  const [
    totalStudents,
    totalInterns,
    totalCoordinators,
    totalPlacedStudents,
    campusWiseStudents,
    branchWiseStudents
  ] = await Promise.all([
    User.countDocuments({ role: ROLES.STUDENT }),
    User.countDocuments({ role: ROLES.STUDENT_INTERN }),
    User.countDocuments({ role: ROLES.CAMPUS_COORDINATOR }),
    User.countDocuments({ placed: true }),

    User.aggregate([
      {
        $group: {
          _id: '$campus',
          count: { $sum: 1 }
        }
      }
    ]),

    User.aggregate([
      {
        $group: {
          _id: '$branch',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  res.json({
    success: true,
    data: {
      totalStudents,
      totalInterns,
      totalCoordinators,
      totalPlacedStudents,
      campusWiseStudents,
      branchWiseStudents
    }
  });
});

export const searchStudent = asyncHandler(async (req, res) => {

  const { studentId } = req.query;

  const student = await User.findOne({
    studentId
  }).select(
    "_id name studentId branch campus"
  );

  if (!student)
    throw new ApiError(404, "Student not found");

  res.json({
    success: true,
    data: student
  });

});


export async function getChatUsers(req, res, next) {

  try {

    const currentUser = req.user;

    let users = [];

    // Dean
    if (currentUser.role === ROLES.DEAN_EITP) {

      users = await User.find({
        role: {
          $in: [
            ROLES.CAMPUS_COORDINATOR,
            ROLES.STUDENT_INTERN
          ]
        }
      })
      .select(
        "name role campus profileImage"
      )
      .sort("name");

    }

    // Coordinator
    else if (
      currentUser.role === ROLES.CAMPUS_COORDINATOR
    ) {

      users = await User.find({
        $or: [
          {
            role: ROLES.DEAN_EITP
          },
          {
            role: ROLES.STUDENT_INTERN,
            campus: currentUser.campus
          }
        ]
      })
      .select(
        "name role campus profileImage"
      )
      .sort("name");

    }

    // Intern
    else if (
      currentUser.role === ROLES.STUDENT_INTERN
    ) {

      users = await User.find({
        $or: [
          {
            role: ROLES.DEAN_EITP
          },
          {
            role: ROLES.CAMPUS_COORDINATOR,
            campus: currentUser.campus
          }
        ]
      })
      .select(
        "name role campus profileImage"
      )
      .sort("name");

    }

    return res.json({
      success: true,
      data: users
    });

  }
  catch (error) {

    next(error);

  }

}

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Only students can be deleted
  if (
    user.role !== ROLES.STUDENT &&
    user.role !== ROLES.STUDENT_INTERN
  ) {
    throw new ApiError(
      400,
      "Only students and interns can be deleted"
    );
  }

  // Coordinator can delete only from own campus
  if (
    req.user.role === ROLES.CAMPUS_COORDINATOR &&
    req.user.campus !== user.campus
  ) {
    throw new ApiError(403, "Access denied");
  }

  await User.findByIdAndDelete(user._id);

  res.json({
    success: true,
    message: "Student deleted successfully"
  });
}); 