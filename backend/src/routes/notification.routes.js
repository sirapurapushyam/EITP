import express from "express";

import {
    getNotifications,
    readNotification
} from "../controllers/notification.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
    "/",
    requireAuth,
    getNotifications
);

router.patch(
    "/:notificationId/read",
    requireAuth,
    readNotification
);

export default router;