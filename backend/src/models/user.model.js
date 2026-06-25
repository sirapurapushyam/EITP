import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../constants/roles.js';
import { CAMPUSES, YEAR_OF_STUDY } from '../constants/campus.constants.js';

const refreshTokenSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      default: ''
    },
    ipAddress: {
      type: String,
      default: ''
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { _id: false }
);

const fileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    // Common Fields
    name: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    personalEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true
    },

    campus: {
      type: String,
      enum: CAMPUSES,
      required: true
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.STUDENT
    },

    approved: {
      type: Boolean,
      default: true
    },

    profileImage: {
      type: fileSchema,
      default: () => ({})
    },

    // Student Fields
    studentId: {
      type: String,
      unique: true,
      sparse: true
    },

    collegeEmail: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },

    branch: {
      type: String,
      default: ''
    },

    yearOfStudy: {
      type: String,
      enum: YEAR_OF_STUDY
    },

    batchYear: Number,

    passedOutYear: Number,

    skills: [
      {
        type: String,
        trim: true
      }
    ],

    resume: {
      type: fileSchema,
      default: () => ({})
    },

    linkedinProfile: {
      type: String,
      default: ''
    },

    githubProfile: {
      type: String,
      default: ''
    },

    placed: {
      type: Boolean,
      default: false
    },
    placedCompany: {
  type: String,
  default: ""
},
    // Faculty Fields
    designation: {
      type: String,
      default: ''
    },

    // Auth
    refreshTokens: {
      type: [refreshTokenSchema],
      default: []
    },

    passwordResetToken: {
      type: String,
      default: ''
    },

    passwordResetExpires: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;

    return ret;
  }
});

export const User = mongoose.model('User', userSchema);