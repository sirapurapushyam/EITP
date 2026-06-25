import mongoose from 'mongoose';
import { ATTENDANCE_STATUS } from '../constants/status.js';

const schema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    attendanceStatus: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      default: ATTENDANCE_STATUS.PENDING
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

schema.index(
  {
    event: 1,
    student: 1
  },
  {
    unique: true
  }
);

export const EventRegistration = mongoose.model(
  'EventRegistration',
  schema
);