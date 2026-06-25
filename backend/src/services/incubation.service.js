import { IncubationIdea } from '../models/incubationIdea.model.js';
import { IncubationTimeline } from '../models/incubationTimeline.model.js';
import { IDEA_STATUS } from '../constants/incubation.constants.js';

export async function addTimeline({
  ideaId,
  action,
  performedBy,
  remarks = ''
}) {
  return IncubationTimeline.create({
    idea: ideaId,
    action,
    performedBy,
    remarks
  });
}

export async function submitIdeaService(user, body) {
  const idea = await IncubationIdea.create({
    title: body.title,
    description: body.description,
    problemStatement: body.problemStatement,
    solution: body.solution,
    expectedOutcome: body.expectedOutcome,
    category: body.category,
    submittedBy: user._id,
    campus: user.campus
  });

  await addTimeline({
    ideaId: idea._id,
    action: 'Idea Submitted',
    performedBy: user._id
  });

  return idea;
}

export async function coordinatorApproveService(id, user, remarks) {
  const idea = await IncubationIdea.findById(id);

  idea.status = IDEA_STATUS.COORDINATOR_APPROVED;
  idea.coordinatorRemarks = remarks;
  idea.coordinatorReviewedBy = user._id;
  idea.coordinatorReviewedAt = new Date();

  await idea.save();

  await addTimeline({
    ideaId: id,
    action: 'Approved By Campus Coordinator',
    performedBy: user._id,
    remarks
  });

  return idea;
}

export async function coordinatorRejectService(id, user, remarks) {
  const idea = await IncubationIdea.findById(id);

  idea.status = IDEA_STATUS.COORDINATOR_REJECTED;
  idea.coordinatorRemarks = remarks;
  idea.coordinatorReviewedBy = user._id;
  idea.coordinatorReviewedAt = new Date();

  await idea.save();

  await addTimeline({
    ideaId: id,
    action: 'Rejected By Campus Coordinator',
    performedBy: user._id,
    remarks
  });

  return idea;
}

export async function deanApproveService(
  id,
  user,
  remarks,
  fundAmount
) {
  const idea = await IncubationIdea.findById(id);

  idea.status = IDEA_STATUS.DEAN_APPROVED;
  idea.deanRemarks = remarks;
  idea.deanReviewedBy = user._id;
  idea.deanReviewedAt = new Date();
  idea.approvedFundAmount = fundAmount;

  await idea.save();

  await addTimeline({
    ideaId: id,
    action: 'Approved By Dean',
    performedBy: user._id,
    remarks
  });

  return idea;
}

export async function deanRejectService(id, user, remarks) {
  const idea = await IncubationIdea.findById(id);

  idea.status = IDEA_STATUS.DEAN_REJECTED;
  idea.deanRemarks = remarks;
  idea.deanReviewedBy = user._id;
  idea.deanReviewedAt = new Date();

  await idea.save();

  await addTimeline({
    ideaId: id,
    action: 'Rejected By Dean',
    performedBy: user._id,
    remarks
  });

  return idea;
}