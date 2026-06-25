import { asyncHandler } from '../utils/asyncHandler.js';
import { EntrepreneurshipApplication } from '../models/entrepreneurship.model.js';
import { ApiError } from '../utils/apiError.js';
import { APPLICATION_TIMELINE } from '../constants/timeline.js';

function nextTimeline(status) {
  return [...status];
}

export const submitApplication = asyncHandler(async (req, res) => {
  const application = await EntrepreneurshipApplication.create({
    ...req.body,
    student: req.user.id,
    timeline: [APPLICATION_TIMELINE.SUBMITTED, APPLICATION_TIMELINE.COORDINATOR_REVIEW]
  });
  res.status(201).json({ success: true, data: application });
});

export const listApplications = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'DEAN_EITP' ? {} : { campus: req.user.campus };
  const applications = await EntrepreneurshipApplication.find(filter).populate('student', 'name email studentId');
  res.json({ success: true, data: applications });
});

export const reviewByCoordinator = asyncHandler(async (req, res) => {
  const application = await EntrepreneurshipApplication.findById(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');
  application.coordinatorStatus = req.body.status;
  application.timeline.push(req.body.status === 'Accepted' ? APPLICATION_TIMELINE.COORDINATOR_APPROVED : 'Coordinator Rejected');
  if (req.body.status === 'Accepted') {
    application.deanStatus = 'Pending';
    application.timeline.push(APPLICATION_TIMELINE.DEAN_REVIEW);
  }
  await application.save();
  res.json({ success: true, data: application });
});

export const reviewByDean = asyncHandler(async (req, res) => {
  const application = await EntrepreneurshipApplication.findById(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');
  application.deanStatus = req.body.status;
  application.timeline.push(req.body.status === 'Accepted' ? APPLICATION_TIMELINE.DEAN_APPROVED : 'Dean Rejected');
  if (req.body.status === 'Accepted') {
    application.fundStatus = 'Released';
    application.timeline.push(APPLICATION_TIMELINE.FUNDS_RELEASED);
  }
  await application.save();
  res.json({ success: true, data: application });
});
