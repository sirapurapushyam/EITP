// services/chat.service.js

import { Chat } from "../models/chat.model.js";

export async function getOrCreateChat(userId1, userId2) {

    let chat = await Chat.findOne({
        participants: {
            $all: [userId1, userId2]
        }
    });

    if (!chat) {

        chat = await Chat.create({
            participants: [userId1, userId2]
        });

    }

    return chat;
}

export async function getUserChats(userId) {

    return Chat.find({
        participants: userId
    })
    .populate(
        "participants",
        "name role campus profileImage"
    )
    .populate({
        path: "lastMessage",
        populate: {
            path: "sender",
            select: "name role"
        }
    })
    .sort("-lastActivity");

}
export async function updateLastMessage(
    chatId,
    messageId
) {

    return Chat.findByIdAndUpdate(
        chatId,
        {
            lastMessage: messageId,
            lastActivity: new Date()
        }
    );

}