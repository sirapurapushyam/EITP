import { Router } from 'express';
import * as controller from '../controllers/campus.controller.js';
import {
  requireAuth,
  authorizeRoles
} from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(requireAuth);

router.get('/', controller.listCampuses);

router.get('/:id', controller.getCampus);

router.patch(
  '/:id/assign-coordinator',
  authorizeRoles(ROLES.DEAN_EITP),
  controller.assignCoordinator
);

router.patch(
  '/:id/refresh-stats',
  authorizeRoles(ROLES.DEAN_EITP),
  controller.refreshCampusStats
);

export default router;