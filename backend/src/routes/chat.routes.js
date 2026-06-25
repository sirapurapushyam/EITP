import express from "express";

import {
    createChat,
    getChats,
    getMessages,
    deleteMessage
} from "../controllers/chat.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();


// Create new chat
router.post(
    "/create",
    requireAuth,
    createChat
);


// Get all chats
router.get(
    "/",
    requireAuth,
    getChats
);


// Get messages of a chat
router.get(
    "/:chatId/messages",
    requireAuth,
    getMessages
);


// Delete message
router.delete(
    "/message/:messageId",
    requireAuth,
    deleteMessage
);


export default router;