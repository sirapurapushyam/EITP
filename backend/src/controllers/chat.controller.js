import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";

import { canChat } from "../services/chatPermission.service.js";
import {
    getOrCreateChat,
    getUserChats
} from "../services/chat.service.js";

import {
    getChatMessages
} from "../services/message.service.js";


// Create chat
export async function createChat(req, res, next) {

    try {

        const sender = req.user;

        const { receiverId } = req.body;

        const receiver = await User.findById(receiverId);

        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const allowed = canChat(sender, receiver);

        if (!allowed) {

            return res.status(403).json({
                success: false,
                message: "Chat not allowed"
            });

        }

        const chat = await getOrCreateChat(
            sender._id,
            receiver._id
        );

        return res.json({
            success: true,
            data: chat
        });

    }
    catch (error) {
        next(error);
    }

}



// Get all chats
export async function getChats(req, res, next) {

    try {

        const chats = await getUserChats(
            req.user._id
        );

        return res.json({
            success: true,
            data: chats
        });

    }
    catch (error) {
        next(error);
    }

}



// Get messages of one chat
export async function getMessages(req, res, next) {

    try {

        const messages = await getChatMessages(
            req.params.chatId
        );

        return res.json({
            success: true,
            data: messages
        });

    }
    catch (error) {
        next(error);
    }

}



// Delete message
export async function deleteMessage(req, res, next) {

    try {

        const message = await Message.findById(
            req.params.messageId
        );

        if (!message) {

            return res.status(404).json({
                success: false,
                message: "Message not found"
            });

        }

        if (
            message.sender.toString() !== req.user._id.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });

        }

        message.deletedForEveryone = true;
        message.content = "This message was deleted";

        await message.save();

        return res.json({
            success: true,
            data: message
        });

    }
    catch (error) {

        next(error);

    }

}