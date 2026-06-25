import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { Campus } from '../models/campus.model.js';
import { User } from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';

export const listCampuses = asyncHandler(async (_req, res) => {
  const campuses = await Campus.find()
    .populate(
      'coordinator',
      'name personalEmail phone designation'
    );

  res.json({
    success: true,
    data: campuses
  });
});

export const getCampus = asyncHandler(async (req, res) => {
  const campus = await Campus.findById(req.params.id)
    .populate(
      'coordinator',
      'name personalEmail phone designation'
    );

  if (!campus) {
    throw new ApiError(404, 'Campus not found');
  }

  res.json({
    success: true,
    data: campus
  });
});

export const assignCoordinator = asyncHandler(async (req, res) => {
  const campus = await Campus.findById(req.params.id);

  if (!campus) {
    throw new ApiError(404, 'Campus not found');
  }

  const coordinator = await User.findById(req.body.coordinatorId);

  if (!coordinator) {
    throw new ApiError(404, 'Coordinator not found');
  }

  if (coordinator.role !== ROLES.CAMPUS_COORDINATOR) {
    throw new ApiError(
      400,
      'User is not a campus coordinator'
    );
  }

  campus.coordinator = coordinator._id;

  coordinator.campus = campus.campusName;

  await coordinator.save();
  await campus.save();

  res.json({
    success: true,
    message: 'Coordinator assigned successfully',
    data: campus
  });
});

export const refreshCampusStats = asyncHandler(async (req, res) => {
  const campus = await Campus.findById(req.params.id);

  if (!campus) {
    throw new ApiError(404, 'Campus not found');
  }

  campus.totalStudents = await User.countDocuments({
    campus: campus.campusName,
    role: ROLES.STUDENT
  });

  campus.totalInterns = await User.countDocuments({
    campus: campus.campusName,
    role: ROLES.STUDENT_INTERN
  });

  await campus.save();

  res.json({
    success: true,
    data: campus
  });
});