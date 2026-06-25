import { asyncHandler } from '../utils/asyncHandler.js';

import {
  submitIdeaService,
  coordinatorApproveService,
  coordinatorRejectService,
  deanApproveService,
  deanRejectService
} from '../services/incubation.service.js';

import { IncubationIdea } from '../models/incubationIdea.model.js';
import { IncubationTimeline } from '../models/incubationTimeline.model.js';
import { IDEA_STATUS } from '../constants/incubation.constants.js';

export const submitIdea = asyncHandler(async (req, res) => {
  const idea = await submitIdeaService(req.user, req.body);

  res.status(201).json({
    success: true,
    message: 'Idea submitted',
    data: idea
  });
});

export const getCoordinatorIdeas = asyncHandler(async (req, res) => {
  const ideas = await IncubationIdea.find({
    campus: req.user.campus,
    status: IDEA_STATUS.SUBMITTED
  })
    .populate('submittedBy', 'name studentId')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: ideas
  });
});

export const coordinatorApprove = asyncHandler(async (req, res) => {
  const idea = await coordinatorApproveService(
    req.params.id,
    req.user,
    req.body.remarks
  );

  res.status(200).json({
    success: true,
    message: 'Approved',
    data: idea
  });
});

export const coordinatorReject = asyncHandler(async (req, res) => {
  const idea = await coordinatorRejectService(
    req.params.id,
    req.user,
    req.body.remarks
  );

  res.status(200).json({
    success: true,
    message: 'Rejected',
    data: idea
  });
});

export const getDeanIdeas = asyncHandler(async (_req, res) => {
  const ideas = await IncubationIdea.find({
    status: IDEA_STATUS.COORDINATOR_APPROVED
  })
    .populate('submittedBy', 'name campus')
    .populate('coordinatorReviewedBy', 'name')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: ideas
  });
});

export const deanApprove = asyncHandler(async (req, res) => {
  const idea = await deanApproveService(
    req.params.id,
    req.user,
    req.body.remarks,
    req.body.fundAmount
  );

  res.status(200).json({
    success: true,
    message: 'Approved',
    data: idea
  });
});

export const deanReject = asyncHandler(async (req, res) => {
  const idea = await deanRejectService(
    req.params.id,
    req.user,
    req.body.remarks
  );

  res.status(200).json({
    success: true,
    message: 'Rejected',
    data: idea
  });
});

export const getIdeaDetails = asyncHandler(async (req, res) => {
  const idea = await IncubationIdea.findById(req.params.id)
    .populate('submittedBy', 'name studentId campus')
    .populate('coordinatorReviewedBy', 'name')
    .populate('deanReviewedBy', 'name');

  const timeline = await IncubationTimeline.find({
    idea: req.params.id
  })
    .populate('performedBy', 'name role')
    .sort('createdAt');

  res.status(200).json({
    success: true,
    data: {
      idea,
      timeline
    }
  });
});

export const getMyIdeas = asyncHandler(async (req, res) => {

  const ideas = await IncubationIdea.find({
    submittedBy: req.user._id
  })
    .populate('submittedBy', 'name studentId')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: ideas
  });

});