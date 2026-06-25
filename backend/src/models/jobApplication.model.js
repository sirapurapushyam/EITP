import mongoose from 'mongoose';
import {
  APPLICATION_STATUS,
  ATTENDANCE_STATUS
} from '../constants/status.js';

const schema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED
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
    job: 1,
    student: 1
  },
  {
    unique: true
  }
);

export const JobApplication = mongoose.model(
  'JobApplication',
  schema
);