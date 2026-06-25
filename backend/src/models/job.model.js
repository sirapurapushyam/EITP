import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true
    },

    role: {
      type: String,
      required: true
    },

    description: String,

    salary: String,

    package: String,

    logo: {
      type: fileSchema,
      default: () => ({})
    },

    targetType: {
      type: String,
      enum: ['ALL_CAMPUSES', 'SPECIFIC_CAMPUSES'],
      default: 'ALL_CAMPUSES'
    },

    targetCampuses: [String],

    createdCampus: {
      type: String,
      required: true
    },

    deadline: Date,

    eligibleBranches: [String],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdRole: {
  type: String,
  enum: [
    "DEAN_EITP",
    "CAMPUS_COORDINATOR"
  ],
  required: true
},


    applicationsCount: {
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

export const Job = mongoose.model('Job', jobSchema);