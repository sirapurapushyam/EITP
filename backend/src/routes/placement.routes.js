import { Router } from "express";
import * as controller from "../controllers/placement.controller.js";
import { requireAuth, authorizeRoles } from "../middleware/auth.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// Everyone
router.get(
  "/",
  requireAuth,
  controller.listPlacements
);

// Statistics
router.get(
  "/stats",
  requireAuth,
  controller.placementStats
);

// Campus-wise placements
router.get(
  "/campus/:campus",
  requireAuth,
  controller.getCampusPlacements
);

// Student placement history
router.get(
  "/student/:studentId",
  requireAuth,
  controller.getStudentPlacements
);

// Add placement
router.post(
  "/",
  requireAuth,
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR
  ),
  controller.createPlacement
);

// Update placement
router.put(
  "/:id",
  requireAuth,
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR
  ),
  controller.updatePlacement
);

// Delete placement
router.delete(
  "/:id",
  requireAuth,
  authorizeRoles(
    ROLES.DEAN_EITP
  ),
  controller.deletePlacement
);

export default router;