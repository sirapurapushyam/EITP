import mongoose from "mongoose";

const placementSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    company: {
      type: String,
      required: true,
      trim: true
    },

    role: {
      type: String,
      required: true,
      trim: true
    },

    jobType: {
      type: String,
      enum: ["Internship", "FullTime", "Intern+FullTime"],
      required: true
    },

    workMode: {
      type: String,
      enum: ["Remote", "InOffice", "Hybrid"],
      required: true
    },

    package: {
      type: Number,
      required: true
    },

    dateOfOffer: {
      type: Date,
      required: true
    },

    campus: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Placement = mongoose.model("Placement", placementSchema);