import { Router } from "express";
import * as controller from "../controllers/dashboard.controller.js";
import { requireAuth, authorizeRoles } from "../middleware/auth.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.get(
  "/dean",
  requireAuth,
  authorizeRoles(ROLES.DEAN_EITP),
  controller.deanOverview
);

router.get(
  "/coordinator",
  requireAuth,
  authorizeRoles(ROLES.CAMPUS_COORDINATOR),
  controller.coordinatorOverview
);

router.get(
  "/student",
  requireAuth,
  authorizeRoles(
    ROLES.STUDENT,
    ROLES.STUDENT_INTERN
  ),
  controller.studentOverview
);

router.get(
  "/intern",
  requireAuth,
  authorizeRoles(ROLES.STUDENT_INTERN),
  controller.internOverview
);

export default router;