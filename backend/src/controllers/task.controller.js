import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { Task } from '../models/task.model.js';
import { notifyUser } from '../sockets/index.js';
import { TASK_STATUS, NOTIFICATION_TYPES } from '../constants/index.js';

export const listTasks = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'DEAN_EITP' ? {} : { $or: [{ assignedBy: req.user.id }, { assignedTo: req.user.id }] };
  const tasks = await Task.find(filter).populate('assignedBy', 'name role').populate('assignedTo', 'name role');
  res.json({ success: true, data: tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, assignedBy: req.user.id });
  await notifyUser({
    title: task.title,
    message: `A new task has been assigned: ${task.title}`,
    receiver: task.assignedTo,
    sender: req.user.id,
    type: NOTIFICATION_TYPES.TASK_ASSIGNED,
    audience: 'individual'
  });
  res.status(201).json({ success: true, data: task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');
  Object.assign(task, req.body);
  await task.save();
  res.json({ success: true, data: task });
});

export const submitTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');
  task.status = TASK_STATUS.COMPLETED;
  task.progress = 100;
  task.submissionFile = req.body.submissionFile || task.submissionFile;
  await task.save();
  res.json({ success: true, data: task });
});
