import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    image: {
      type: fileSchema,
      default: () => ({})
    },

    targetType: {
      type: String,
      enum: ['ALL_CAMPUSES', 'SPECIFIC_CAMPUSES'],
      default: 'ALL_CAMPUSES'
    },

    targetCampuses: [
      {
        type: String
      }
    ],

    createdCampus: {
      type: String,
      required: true
    },

    eventDate: {
      type: Date,
      required: true
    },

    eventTime: {
      type: String,
      default: ''
    },

    registrationDeadline: {
      type: Date,
      required: true
    },

    numberOfDays: {
      type: Number,
      default: 1
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdRole: {
    type: String,
    enum: [
        "DEAN_EITP",
        "CAMPUS_COORDINATOR"
    ],
    required: true
},

    registrationsCount: {
      type: Number,
      default: 0
    },

    attendanceCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Event = mongoose.model('Event', eventSchema);