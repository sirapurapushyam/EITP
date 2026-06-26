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
    minlength: 8,
    select: false,
    default: null
  },

      personalEmail: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        default: ""
      },

      phone: {
    type: String,
    default: ""
  },
      campus: {
  type: String,
  enum: CAMPUSES,
  default: null
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
      googleId: {
    type: String,
    default: "",
    index: true
},

// authProvider: {
//     type: String,
//     enum: ["local","google"],
//     default: "local"
// },

profileCompleted: {
    type: Boolean,
    default: true
},

    // Student Fields
    // studentId: {
    //   type: String,
    //   unique: true,
    //   sparse: true
    // },
    studentId: {
  type: String,
  unique: true,
  sparse: true,
  default: null
},

    collegeEmail: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      default:null
    },

    branch: {
      type: String,
      default: ''
    },

 yearOfStudy: {
  type: String,
  enum:YEAR_OF_STUDY,
  default: null
},

    batchYear: {
  type: Number,
  default: null
},

    passedOutYear: {
  type: Number,
  default: null
},

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
  },
  
);


userSchema.pre("validate", function (next) {

  // Skip validation for incomplete Google profiles
  if (!this.profileCompleted) {
    return next();
  }

  // Fields required for everyone
  const commonFields = [
    "name",
    "phone",
    "campus"
  ];

  for (const field of commonFields) {
    if (
      this[field] === null ||
      this[field] === undefined ||
      this[field] === ""
    ) {
      return next(new Error(`${field} is required`));
    }
  }

  // Student-specific validation
  if (
    this.role === ROLES.STUDENT ||
    this.role === ROLES.STUDENT_INTERN
  ) {

    const studentFields = [
      "studentId",
      "collegeEmail",
      "branch",
      "yearOfStudy"
    ];

    for (const field of studentFields) {
      if (
        this[field] === null ||
        this[field] === undefined ||
        this[field] === ""
      ) {
        return next(new Error(`${field} is required`));
      }
    }
  }

  next();
});
userSchema.pre("save", async function (next) {

  if (!this.password) {
    return next();
  }

  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.comparePassword = function (password) {

  if (!this.password) {
    return false;
  }

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