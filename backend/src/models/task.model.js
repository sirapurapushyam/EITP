import mongoose from 'mongoose';
import { TASK_STATUS } from '../constants/status.js';

const fileSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    priority: { type: String, default: 'Medium' },
    deadline: { type: Date, required: true },
    status: { type: String, enum: Object.values(TASK_STATUS), default: TASK_STATUS.PENDING },
    submissionFile: { type: fileSchema, default: () => ({}) },
    progress: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', taskSchema);
