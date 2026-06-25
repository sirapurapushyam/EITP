import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
{
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],

    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },

    lastActivity: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
}
);

// Prevent duplicate chat between same users
chatSchema.index(
{
    participants: 1
});

export const Chat = mongoose.model(
    "Chat",
    chatSchema
);