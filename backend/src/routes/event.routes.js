import { Router } from 'express';
import { z } from 'zod';
import * as controller from '../controllers/event.controller.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ROLES } from '../constants/roles.js';
import { upload } from '../config/multer.js';
import { ATTENDANCE_STATUS } from '../constants/status.js';

const router = Router();

// const eventSchema = z.object({
//   title: z.string().min(2),
//   description: z.string().min(5),
//   targetType: z.enum(['ALL_CAMPUSES', 'SPECIFIC_CAMPUSES']),
//   targetCampuses: z.preprocess(
//   (value) => {
//     if (!value) return [];

//     if (Array.isArray(value)) return value;

//     if (typeof value === "string") {
//       try {
//         return JSON.parse(value);
//       } catch {
//         return [value];
//       }
//     }

//     return [];
//   },
//   z.array(z.string())
// ),
//   eventDate: z.string(),
//   eventTime: z.string().optional().default(''),
//   registrationDeadline: z.string(),
//   numberOfDays: z.coerce.number().default(1)
// });


const campusesSchema = z.preprocess((value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    // JSON array sent by Dean
    if (trimmed.startsWith("[")) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return [];
      }
    }

    // Single campus sent by Coordinator
    return [trimmed];
  }

  return [];
}, z.array(z.string()));

const eventSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  targetType: z.enum([
    "ALL_CAMPUSES",
    "SPECIFIC_CAMPUSES",
  ]),
  targetCampuses: campusesSchema,
  eventDate: z.string(),
  eventTime: z.string().optional().default(""),
  registrationDeadline: z.string(),
  numberOfDays: z.coerce.number().default(1),
});
const attendanceSchema = z.object({
  studentId: z.string(),
  status: z.enum(Object.values(ATTENDANCE_STATUS))
});

router.get('/', requireAuth, controller.listEvents);

router.post(
  '/',
  requireAuth,
  authorizeRoles(ROLES.DEAN_EITP, ROLES.CAMPUS_COORDINATOR),
  upload.single('image'),
  validate(eventSchema),
  controller.createEvent
);

router.post(
  '/:id/register',
  requireAuth,
  authorizeRoles(ROLES.STUDENT, ROLES.STUDENT_INTERN),
  controller.registerForEvent
);

router.get(
  '/:id/registrations',
  requireAuth,
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR,
    ROLES.STUDENT_INTERN
  ),
  controller.listRegistrations
);

router.patch(
  '/:id/attendance',
  requireAuth,
  authorizeRoles(
    ROLES.CAMPUS_COORDINATOR,
    ROLES.STUDENT_INTERN
  ),
  validate(attendanceSchema),
  controller.markAttendance
);

router.patch(
  '/:id',
  requireAuth,
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR
  ),
  controller.updateEvent
);

router.delete(
  '/:id',
  requireAuth,
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR
  ),
  controller.deleteEvent
);

export default router;