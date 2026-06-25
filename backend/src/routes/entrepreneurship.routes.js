import { Router } from 'express';
import * as controller from '../controllers/entrepreneurship.controller.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.get('/', requireAuth, controller.listApplications);
router.post('/', requireAuth, authorizeRoles(ROLES.STUDENT, ROLES.STUDENT_INTERN), controller.submitApplication);
router.patch('/:id/coordinator-review', requireAuth, authorizeRoles(ROLES.CAMPUS_COORDINATOR), controller.reviewByCoordinator);
router.patch('/:id/dean-review', requireAuth, authorizeRoles(ROLES.DEAN_EITP), controller.reviewByDean);

export default router;
