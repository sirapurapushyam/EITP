import mongoose from 'mongoose';

const incubationTimelineSchema = new mongoose.Schema(
  {
    idea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IncubationIdea',
      required: true
    },

    action: {
      type: String,
      required: true
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    remarks: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const IncubationTimeline = mongoose.model(
  'IncubationTimeline',
  incubationTimelineSchema
);