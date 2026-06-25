import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { Event } from '../models/event.model.js';
import { EventRegistration } from '../models/eventRegistration.model.js';
// import { Attendance } from '../models/attendance.model.js';
import { uploadBufferToCloudinary } from '../utils/fileUpload.js';
import { isCampusScoped } from '../middleware/auth.middleware.js';
import { emitEvent } from "../sockets/index.js";

function parseCampuses(value) {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }
  }

  return [];
}

export const listEvents = asyncHandler(async (req, res) => {
  let filter = {};

  if (req.user.role !== 'DEAN_EITP') {
    filter = {
      $or: [
        { targetType: 'ALL_CAMPUSES' },
        { targetCampuses: req.user.campus }
      ]
    };
  }

  const events = await Event.find(filter)
    .populate("createdBy", "name role campus");

  let registrationsMap = {};

  if (
    req.user.role === 'STUDENT' ||
    req.user.role === 'STUDENT_INTERN'
  ) {
    const registrations = await EventRegistration.find({
      student: req.user._id
    });

    registrationsMap = registrations.reduce((acc, item) => {
      acc[item.event.toString()] = item;
      return acc;
    }, {});
  }

  const data = events.map((event) => ({
    ...event.toObject(),
    registration:
      registrationsMap[event._id.toString()] || null
  }));

  res.json({
    success: true,
    data
  });
});
export const createEvent = asyncHandler(async (req, res) => {

  let targetCampuses = [];
  const campuses = parseCampuses(req.body.targetCampuses);

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

  const image = req.file
    ? await uploadBufferToCloudinary(req.file.buffer, 'events')
    : { url: '', publicId: '' };

 const event = await Event.create({
  ...req.body,
  image,
  targetCampuses,
  createdCampus: req.user.campus,
  createdRole: req.user.role,
  createdBy: req.user._id
});
await event.populate(
    "createdBy",
    "name role campus"
);

emitEvent({
    _id: event._id,
    title: event.title,
    eventDate: event.eventDate,
    targetType: event.targetType,
    targetCampuses: event.targetCampuses,
    createdBy: event.createdBy
});

  res.status(201).json({
    success: true,
    data: event
  });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Dean can edit every event
  if (req.user.role !== "DEAN_EITP") {
    // Coordinator can edit only own events
    if (event.createdBy.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You can edit only events created by you."
      );
    }
  }

  Object.assign(event, req.body);

  await event.save();

  res.json({
    success: true,
    data: event
  });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Dean can delete every event
  if (req.user.role !== "DEAN_EITP") {
    // Coordinator can delete only own events
    if (event.createdBy.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You can delete only events created by you."
      );
    }
  }

  await Event.findByIdAndDelete(event._id);

  await EventRegistration.deleteMany({
    event: event._id
  });

  res.json({
    success: true,
    message: "Event deleted successfully"
  });
});

export const registerForEvent = asyncHandler(async (req, res) => {

  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (new Date() > new Date(event.registrationDeadline)) {
    throw new ApiError(400, 'Registration deadline expired');
  }

  const exists = await EventRegistration.findOne({
    event: event._id,
    student: req.user._id
  });

  if (exists) {
    throw new ApiError(400, 'Already registered');
  }

  await EventRegistration.create({
    event: event._id,
    student: req.user._id
  });

  event.registrationsCount += 1;

  await event.save();

  res.status(201).json({
    success: true,
    message: 'Registered successfully'
  });

});
export const listRegistrations = asyncHandler(async (req, res) => {

  const registrations = await EventRegistration.find({
    event: req.params.id
  }).populate(
    'student',
    'name studentId branch phone campus'
  );

  if (req.user.role === 'DEAN_EITP') {

    const presentCount = registrations.filter(
      x => x.attendanceStatus === 'Present'
    ).length;

    const absentCount = registrations.filter(
      x => x.attendanceStatus === 'Absent'
    ).length;

    return res.json({
      success: true,
      data: {
        registrationCount: registrations.length,
        presentCount,
        absentCount
      }
    });
  }

  res.json({
    success: true,
    data: {
      presentStudents:
        registrations.filter(
          x => x.attendanceStatus === 'Present'
        ),

      absentStudents:
        registrations.filter(
          x => x.attendanceStatus === 'Absent'
        ),

      pendingStudents:
        registrations.filter(
          x => x.attendanceStatus === 'Pending'
        )
    }
  });

});

export const markAttendance = asyncHandler(async (req, res) => {

  const registration =
    await EventRegistration.findOne({
      event: req.params.id,
      student: req.body.studentId
    });

  if (!registration) {
    throw new ApiError(
      404,
      'Registration not found'
    );
  }

  registration.attendanceStatus = req.body.status;
  registration.markedBy = req.user._id;

  await registration.save();

  const event = await Event.findById(req.params.id);

  event.attendanceCount =
    await EventRegistration.countDocuments({
      event: req.params.id,
      attendanceStatus: 'Present'
    });

  await event.save();

  res.json({
    success: true,
    data: registration
  });

});
