import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { Job } from '../models/job.model.js';
import { JobApplication } from '../models/jobApplication.model.js';
import { APPLICATION_STATUS } from '../constants/status.js';
import { uploadBufferToCloudinary } from '../utils/fileUpload.js';
import { isCampusScoped } from '../middleware/auth.middleware.js';
import { emitJob } from "../sockets/index.js";

function parseCampuses(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(campus => campus.trim())
      .filter(Boolean);
  }
  return [];
}

// ==================== LIST JOBS ====================
export const listJobs = asyncHandler(async (req, res) => {

  let jobs;

  if (req.user.role === 'DEAN_EITP') {

    jobs = await Job.find()
  .populate("createdBy", "name role campus")
  .sort({ createdAt: -1 });

  } else {

    jobs = await Job.find({
  $or: [
    { targetCampuses: { $size: 0 } },
    { targetCampuses: req.user.campus }
  ]
})
.populate("createdBy", "name role campus")
.sort({ createdAt: -1 });

  }

  let applicationMap = {};

  if (
    req.user.role === 'STUDENT' ||
    req.user.role === 'STUDENT_INTERN'
  ) {

    const applications =
      await JobApplication.find({
        student: req.user._id
      });

    applicationMap =
      applications.reduce(
        (acc, item) => {

          acc[
            item.job.toString()
          ] = item;

          return acc;

        },
        {}
      );

  }

  const data = jobs.map(
    (job) => ({
      ...job.toObject(),
      application:
        applicationMap[
          job._id.toString()
        ] || null
    })
  );

  res.json({
    success: true,
    data
  });

});

// ==================== CREATE JOB ====================
export const createJob = asyncHandler(async (req, res) => {

 const campuses = parseCampuses(req.body.targetCampuses);

let targetCampuses = [];

if (req.user.role === "DEAN_EITP") {

    targetCampuses =
        req.body.targetType === "ALL_CAMPUSES"
            ? []
            : campuses;

} else {

    targetCampuses =
        req.body.targetType === "ALL_CAMPUSES"
            ? []
            : [req.user.campus];

}

  const logo = req.file
    ? await uploadBufferToCloudinary(req.file.buffer, 'companies')
    : {
        url: '',
        publicId: ''
      };

  const job = await Job.create({
    ...req.body,
    logo,
    targetCampuses,
    createdCampus: req.user.campus,
    createdRole: req.user.role,
    createdBy: req.user._id
});
await job.populate(
    "createdBy",
    "name role campus"
);

emitJob({
    _id: job._id,
    companyName: job.companyName,
    role: job.role,
    deadline: job.deadline,
    targetType: job.targetType,
    targetCampuses: job.targetCampuses,
    createdBy: job.createdBy,
});
  res.status(201).json({
    success: true,
    data: job
  });
});

// ==================== UPDATE JOB ====================
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

 if (req.user.role !== "DEAN_EITP") {

    if (
        job.createdBy.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You can edit only jobs created by you."
        );
    }

}

  Object.assign(job, req.body);

  await job.save();

  res.json({
    success: true,
    data: job
  });
});

// ==================== DELETE JOB ====================
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  if (req.user.role !== "DEAN_EITP") {

    if (
        job.createdBy.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You can delete only jobs created by you."
        );
    }

}

  await Job.findByIdAndDelete(req.params.id);
  await JobApplication.deleteMany({ job: job._id });

  res.json({
    success: true,
    message: 'Job deleted'
  });
});

// ==================== APPLY FOR JOB ====================
export const applyForJob = asyncHandler(async (req, res) => {

  const job = await Job.findById(
    req.params.id
  );

  if (!job) {
    throw new ApiError(
      404,
      'Job not found'
    );
  }

  // deadline expired
  if (
    new Date() >
    new Date(job.deadline)
  ) {
    throw new ApiError(
      400,
      'Application deadline expired'
    );
  }

  const exists =
    await JobApplication.findOne({
      job: job._id,
      student: req.user._id
    });

  if (exists) {
    throw new ApiError(
      400,
      'Already applied'
    );
  }

  const application =
    await JobApplication.create({
      job: job._id,
      student: req.user._id,
      status:
        APPLICATION_STATUS.APPLIED
    });

  job.applicationsCount += 1;

  await job.save();

  res.status(201).json({
    success: true,
    data: application
  });

});

// ==================== LIST APPLICATIONS ====================
export const listApplications = asyncHandler(async (req, res) => {
  const applications = await JobApplication.find({
    job: req.params.id
  }).populate(
    'student',
    'name studentId branch phone campus'
  );

  if (req.user.role === 'DEAN_EITP') {
    const presentCount = applications.filter(
      x => x.attendanceStatus === 'Present'
    ).length;

    const absentCount = applications.filter(
      x => x.attendanceStatus === 'Absent'
    ).length;

    return res.json({
      success: true,
      data: {
        applicationsCount: applications.length,
        presentCount,
        absentCount
      }
    });
  }

  res.json({
    success: true,
    data: {
      presentStudents: applications.filter(
        x => x.attendanceStatus === 'Present'
      ),
      absentStudents: applications.filter(
        x => x.attendanceStatus === 'Absent'
      ),
      pendingStudents: applications.filter(
        x => x.attendanceStatus === 'Pending'
      )
    }
  });
});

// ==================== MARK ATTENDANCE ====================
export const markAttendance = asyncHandler(async (req, res) => {
  const application = await JobApplication.findOne({
    job: req.params.id,
    student: req.body.studentId
  });

  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  application.attendanceStatus = req.body.status;
  application.markedBy = req.user._id;

  await application.save();

  const job = await Job.findById(req.params.id);

  job.attendanceCount = await JobApplication.countDocuments({
    job: req.params.id,
    attendanceStatus: 'Present'
  });

  await job.save();

  res.json({
    success: true,
    data: application
  });
});

// ==================== UPDATE APPLICATION STATUS ====================
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await JobApplication.findById(
    req.params.applicationId
  );

  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  application.status = req.body.status;

  await application.save();

  res.json({
    success: true,
    data: application
  });
});