import mongoose from "mongoose";

export const ANNOUNCEMENT_AUDIENCE = Object.freeze([
  "ALL",
  "ALL_STUDENTS",
  "ALL_INTERNS",
  "ALL_COORDINATORS",
  "CAMPUS_STUDENTS",
  "CAMPUS_INTERNS",
]);

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    audience: {
      type: String,
      enum: ANNOUNCEMENT_AUDIENCE,
      required: true,
      index: true,
    },

    // Required only for campus announcements
    campus: {
      type: String,
      default: null,
      index: true,
    },

    attachments: [
      {
        url: {
          type: String,
        },

        publicId: {
          type: String,
        },

        fileName: {
          type: String,
        },
      },
    ],

    // Users who removed/dismissed this announcement
    dismissedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Helpful indexes
 */
announcementSchema.index({
  audience: 1,
  campus: 1,
  createdAt: -1,
});

announcementSchema.index({
  sender: 1,
  createdAt: -1,
});

export const Announcement = mongoose.model(
  "Announcement",
  announcementSchema
);