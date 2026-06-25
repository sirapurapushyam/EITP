import mongoose from 'mongoose';
import { IDEA_STATUS } from '../constants/incubation.constants.js';

const fileSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String
  },
  { _id: false }
);

const incubationIdeaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    problemStatement: {
      type: String,
      default: ''
    },

    solution: {
      type: String,
      default: ''
    },

    expectedOutcome: {
      type: String,
      default: ''
    },

    category: {
      type: String,
      default: ''
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    campus: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: Object.values(IDEA_STATUS),
      default: IDEA_STATUS.SUBMITTED
    },

    coordinatorRemarks: {
      type: String,
      default: ''
    },

    coordinatorReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    coordinatorReviewedAt: Date,

    deanRemarks: {
      type: String,
      default: ''
    },

    deanReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    deanReviewedAt: Date,

    approvedFundAmount: {
      type: Number,
      default: 0
    },

    fundAllocatedAt: Date,

    documents: [fileSchema]
  },
  {
    timestamps: true
  }
);

export const IncubationIdea = mongoose.model(
  'IncubationIdea',
  incubationIdeaSchema
);