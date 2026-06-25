import mongoose from 'mongoose';
import { CAMPUSES } from '../constants/campus.constants.js';

const campusSchema = new mongoose.Schema(
  {
    campusName: {
      type: String,
      enum: CAMPUSES,
      required: true,
      unique: true
    },

    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    totalStudents: {
      type: Number,
      default: 0
    },

    totalInterns: {
      type: Number,
      default: 0
    },

    totalEvents: {
      type: Number,
      default: 0
    },

    totalJobs: {
      type: Number,
      default: 0
    },

    totalPlacements: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Campus = mongoose.model('Campus', campusSchema); 