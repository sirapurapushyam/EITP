// services/message.service.js

import { Message } from "../models/message.model.js";

export async function createMessage(
    chatId,
    senderId,
    content,
    attachments = []
) {

    return Message.create({
        chat: chatId,
        sender: senderId,
        content,
        attachments
    });

}
export async function getChatMessages(chatId) {

    return Message.find({
        chat: chatId
    })
    .populate(
        "sender",
        "name role campus profileImage"
    )
    .sort("createdAt");

}export async function markMessageSeen(
    messageId,
    userId
) {

    return Message.findByIdAndUpdate(
        messageId,
        {
            $addToSet: {
                seenBy: userId
            }
        },
        {
            new: true
        }
    );

}
export async function deleteMessage(
    messageId
) {

    return Message.findByIdAndUpdate(
        messageId,
        {
            deletedForEveryone: true,
            content: "This message was deleted"
        },
        {
            new: true
        }
    );

}