import { Router } from 'express';

import {
  submitIdea,
  getCoordinatorIdeas,
  coordinatorApprove,
  coordinatorReject,
  getDeanIdeas,
  deanApprove,
  deanReject,
  getIdeaDetails,
  getMyIdeas
} from '../controllers/incubation.controller.js';

import {
  requireAuth,
  authorizeRoles
} from '../middleware/auth.middleware.js';

import { ROLES } from '../constants/roles.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  authorizeRoles(
    ROLES.STUDENT,
    ROLES.STUDENT_INTERN
  ),
  submitIdea
);
router.get(
  '/my',
  requireAuth,
  authorizeRoles(
    ROLES.STUDENT,
    ROLES.STUDENT_INTERN
  ),
  getMyIdeas
);
router.get(
  '/coordinator',
  requireAuth,
  authorizeRoles(ROLES.CAMPUS_COORDINATOR),
  getCoordinatorIdeas
);

router.patch(
  '/:id/coordinator-approve',
  requireAuth,
  authorizeRoles(ROLES.CAMPUS_COORDINATOR),
  coordinatorApprove
);

router.patch(
  '/:id/coordinator-reject',
  requireAuth,
  authorizeRoles(ROLES.CAMPUS_COORDINATOR),
  coordinatorReject
);

router.get(
  '/dean',
  requireAuth,
  authorizeRoles(ROLES.DEAN_EITP),
  getDeanIdeas
);

router.patch(
  '/:id/dean-approve',
  requireAuth,
  authorizeRoles(ROLES.DEAN_EITP),
  deanApprove
);

router.patch(
  '/:id/dean-reject',
  requireAuth,
  authorizeRoles(ROLES.DEAN_EITP),
  deanReject
);

router.get(
  '/:id',
  requireAuth,
  getIdeaDetails
);

export default router;