import { asyncHandler } from '../utils/asyncHandler.js';
import { Placement } from '../models/placement.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES } from "../constants/roles.js";

export const listPlacements = asyncHandler(async (_req, res) => {
  const placements = await Placement.find()
    .populate(
      "student",
      "name studentId branch campus"
    )
    .sort({ dateOfOffer: -1 });

  res.json({
    success: true,
    data: placements
  });
});

export const createPlacement = asyncHandler(async (req, res) => {

  const student = await User.findById(req.body.student);

  if (!student)
    throw new ApiError(404, "Student not found");

  // Coordinator restriction
  if (
    req.user.role === ROLES.CAMPUS_COORDINATOR &&
    student.campus !== req.user.campus
  ) {
    throw new ApiError(
      403,
      "Can add placement only for your campus students"
    );
  }

  const placement = await Placement.create({
    student: student._id,
    company: req.body.company,
    role: req.body.role,
    jobType: req.body.jobType,
    workMode: req.body.workMode,
    package: req.body.package,
    dateOfOffer: req.body.dateOfOffer,
    campus: student.campus
  });

  student.placed = true;
  student.placedCompany = req.body.company;

  await student.save();

  res.status(201).json({
    success: true,
    data: placement
  });
});

export const placementStats = asyncHandler(async (_req, res) => {

  const totalPlaced = await Placement.countDocuments();

  const byCampus = await Placement.aggregate([
    {
      $group: {
        _id: "$campus",
        total: {
          $sum: 1
        }
      }
    }
  ]);

  const byCompany = await Placement.aggregate([
    {
      $group: {
        _id: "$company",
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      totalPlaced,
      byCampus,
      byCompany
    }
  });
});

export const updatePlacement = asyncHandler(async (req, res) => {

  const placement = await Placement.findById(req.params.id);

  if (!placement)
    throw new ApiError(404, "Placement not found");

  if (
    req.user.role === ROLES.CAMPUS_COORDINATOR &&
    placement.campus !== req.user.campus
  ) {
    throw new ApiError(
      403,
      "Cannot edit other campus placements"
    );
  }

  const updatedPlacement = await Placement.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true
    }
  );

  res.json({
    success: true,
    data: updatedPlacement
  });
});
export const deletePlacement = asyncHandler(async (req, res) => {

  const placement = await Placement.findById(req.params.id);

  if (!placement)
    throw new ApiError(404, "Placement not found");

  await Placement.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Placement deleted successfully"
  });
});

export const getCampusPlacements = asyncHandler(async (req, res) => {

  const placements = await Placement.find({
    campus: req.params.campus
  })
    .populate(
      "student",
      "name studentId branch"
    );

  res.json({
    success: true,
    data: placements
  });
});

export const getStudentPlacements = asyncHandler(async (req, res) => {

  const placements = await Placement.find({
    student: req.params.studentId
  });

  res.json({
    success: true,
    data: placements
  });
});