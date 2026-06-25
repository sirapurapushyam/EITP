import { Notification } from "../models/notification.model.js";

import {
    markNotificationRead
} from "../services/notification.service.js";



export async function getNotifications(
    req,
    res,
    next
) {

    try {

        const notifications =
            await Notification.find({
                receiver: req.user._id
            })
            .populate(
                "sender",
                "name role"
            )
            .sort("-createdAt");

        return res.json({
            success: true,
            data: notifications
        });

    }
    catch (error) {

        next(error);

    }

}
export async function readNotification(
    req,
    res,
    next
) {

    try {

        const notification =
            await markNotificationRead(
                req.params.notificationId
            );

        return res.json({
            success: true,
            data: notification
        });

    }
    catch (error) {

        next(error);

    }

}