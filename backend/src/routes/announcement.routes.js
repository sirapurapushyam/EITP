import express from "express";
import { ROLES } from "../constants/roles.js";

import {
  sendAnnouncement,
  getAnnouncements,
  dismissAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller.js";

import {
  requireAuth,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", sendAnnouncement);

router.get("/", getAnnouncements);

router.patch("/:id/dismiss", dismissAnnouncement);

router.delete(
  "/:id",
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR
  ),
  deleteAnnouncement
);

export default router;