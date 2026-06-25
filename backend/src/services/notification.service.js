// services/notification.service.js

import { Notification } from "../models/notification.model.js";
import { getIO } from "../sockets/index.js";

export async function createNotification({
    receiver,
    sender,
    title,
    message,
    type,
    referenceId = null
}) {

    const notification = await Notification.create({
        receiver,
        sender,
        title,
        message,
        type,
        referenceId
    });

    const io = getIO();

    if (io) {

        io.to(`user:${receiver}`)
            .emit(
                "new_notification",
                notification
            );

    }

    return notification;

}
export async function markNotificationRead(
    notificationId
) {

    return Notification.findByIdAndUpdate(
        notificationId,
        {
            isRead: true
        },
        {
            new: true
        }
    );

}
export async function getUnreadNotifications(
    userId
) {

    return Notification.find({
        receiver: userId,
        isRead: false
    })
    .sort("-createdAt");

}