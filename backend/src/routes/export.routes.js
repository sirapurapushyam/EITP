import { Router } from 'express';
import * as controller from '../controllers/export.controller.js';
import {
  requireAuth,
  authorizeRoles
} from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(requireAuth);

router.get(
  '/events/:id/pdf',
  authorizeRoles(
    ROLES.CAMPUS_COORDINATOR,
    ROLES.STUDENT_INTERN
  ),
  controller.exportEventPdf
);

router.get(
  '/events/:id/excel',
  authorizeRoles(
    ROLES.CAMPUS_COORDINATOR,
    ROLES.STUDENT_INTERN
  ),
  controller.exportEventExcel
);

router.get(
  '/jobs/:id/pdf',
  authorizeRoles(
    ROLES.CAMPUS_COORDINATOR,
    ROLES.STUDENT_INTERN
  ),
  controller.exportJobPdf
);

router.get(
  '/jobs/:id/excel',
  authorizeRoles(
    ROLES.CAMPUS_COORDINATOR,
    ROLES.STUDENT_INTERN
  ),
  controller.exportJobExcel
);

export default router;