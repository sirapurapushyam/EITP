import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
{
    url: String,

    publicId: String,

    fileName: String,

    mimeType: String
},
{
    _id: false
});

const messageSchema = new mongoose.Schema(
{
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    content: {
        type: String,
        trim: true,
        default: ""
    },

    attachments: {
        type: [attachmentSchema],
        default: []
    },

    seenBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    edited: {
        type: Boolean,
        default: false
    },

    deletedForEveryone: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

export const Message = mongoose.model(
    "Message",
    messageSchema
);