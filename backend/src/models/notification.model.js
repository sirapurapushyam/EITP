import mongoose from "mongoose";

export const NOTIFICATION_TYPES = Object.freeze([
    "CHAT",
    "ANNOUNCEMENT",
    "TASK",
    "EVENT",
    "JOB"
]);

const notificationSchema = new mongoose.Schema(
{
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: NOTIFICATION_TYPES,
        required: true
    },

    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },

    isRead: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

export const Notification = mongoose.model(
    "Notification",
    notificationSchema
);