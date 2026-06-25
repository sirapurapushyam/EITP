import { Router } from 'express';
import { z } from 'zod';
import * as controller from '../controllers/job.controller.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ROLES } from '../constants/roles.js';
import { upload } from '../config/multer.js';

const router = Router();
const jobSchema = z.object({
	companyName: z.string().min(2),
	role: z.string().min(2),
	jobType: z.string().optional().default(''),
	description: z.string().min(5),
	companyJd: z.string().optional().default(''),
	salary: z.string().optional().default(''),
	package: z.string().optional().default(''),
	bond: z.string().optional().default(''),
	campus: z.string().optional().or(z.literal('')),
	campuses: z.string().optional().or(z.literal('')),
	audience: z.enum(['all', 'specific']).default('all'),
	deadline: z.string().min(1),
	placementDateTime: z.string().optional().default(''),
	roundsDescription: z.string().optional().default(''),
	eligibleBranches: z.array(z.string()).optional().default([]),
	logo: z.any().optional()
});

const applicationStatusSchema = z.object({ status: z.enum(['Applied', 'Shortlisted', 'Rejected', 'Placed']) });

router.get('/', requireAuth, controller.listJobs);

router.post(
 '/',
 requireAuth,
 authorizeRoles(
   ROLES.DEAN_EITP,
   ROLES.CAMPUS_COORDINATOR
 ),
 upload.single('logo'),
 validate(jobSchema),
 controller.createJob
);

router.post(
 '/:id/apply',
 requireAuth,
 authorizeRoles(
   ROLES.STUDENT,
   ROLES.STUDENT_INTERN
 ),
 controller.applyForJob
);

router.get(
 '/:id/applications',
 requireAuth,
 authorizeRoles(
   ROLES.DEAN_EITP,
   ROLES.CAMPUS_COORDINATOR,
   ROLES.STUDENT_INTERN
 ),
 controller.listApplications
);

router.patch(
 '/:id/attendance',
 requireAuth,
 authorizeRoles(
   ROLES.CAMPUS_COORDINATOR,
   ROLES.STUDENT_INTERN
 ),
 controller.markAttendance
);

router.patch(
 '/:id/applications/:applicationId',
 requireAuth,
 authorizeRoles(
   ROLES.DEAN_EITP,
   ROLES.CAMPUS_COORDINATOR
 ),
 controller.updateApplicationStatus
);

router.patch(
 '/:id',
 requireAuth,
 authorizeRoles(
   ROLES.DEAN_EITP,
   ROLES.CAMPUS_COORDINATOR
 ),
 controller.updateJob
);

router.delete(
 '/:id',
 requireAuth,
 authorizeRoles(
   ROLES.DEAN_EITP,
   ROLES.CAMPUS_COORDINATOR
 ),
 controller.deleteJob
);
export default router;
