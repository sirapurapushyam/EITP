import { Server } from "socket.io";

import { verifyAccessToken } from "../utils/token.js";

import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";

let io;

const onlineUsers = new Map();

export function initSocket(server) {

    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }
    });

    /*
    -----------------------------------
    SOCKET AUTH
    -----------------------------------
    */

    io.use((socket, next) => {

        try {

            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(new Error("Unauthorized"));
            }

            const decoded = verifyAccessToken(token);

            socket.user = decoded;

            next();

        }
        catch (error) {

            next(new Error("Unauthorized"));

        }

    });


    /*
    -----------------------------------
    CONNECTION
    -----------------------------------
    */

    io.on("connection", (socket) => {

        const user = socket.user;

        const userId = user.sub;


        /*
        -----------------------------------
        USER ROOM
        -----------------------------------
        */

        socket.join(`user:${userId}`);

        /*
        -----------------------------------
        ROLE ROOM
        -----------------------------------
        */

        // socket.join(`role:${user.role}`);

        /*
        -----------------------------------
        CAMPUS ROOM
        -----------------------------------
        */

        // socket.join(`campus:${user.campus}`);
        socket.join(`role:${user.role}`);

if (user.role === "STUDENT") {
  socket.join(
    `campus:${user.campus}:STUDENT`
  );
   console.log("Joined:", `campus:${user.campus}:STUDENT`);
}

if (user.role === "STUDENT_INTERN") {
  socket.join(
    `campus:${user.campus}:INTERN`
  );
  console.log("Joined:", `campus:${user.campus}:INTERN`);
}

        /*
        -----------------------------------
        ONLINE USERS
        -----------------------------------
        */

        onlineUsers.set(userId, socket.id);

        io.emit(
            "online_users",
            Array.from(onlineUsers.keys())
        );


        /*
        ===================================
        JOIN CHAT ROOM
        ===================================
        */

        socket.on(
            "join_chat",
            (chatId) => {

                socket.join(`chat:${chatId}`);

            }
        );


        /*
        ===================================
        LEAVE CHAT ROOM
        ===================================
        */

        socket.on(
            "leave_chat",
            (chatId) => {

                socket.leave(`chat:${chatId}`);

            }
        );


        /*
        ===================================
        TYPING
        ===================================
        */

        socket.on(
            "typing",
            ({ chatId }) => {

                socket.to(
                    `chat:${chatId}`
                ).emit(
                    "typing",
                    {
                        chatId,
                        userId
                    }
                );

            }
        );


        /*
        ===================================
        STOP TYPING
        ===================================
        */

        socket.on(
            "stop_typing",
            ({ chatId }) => {

                socket.to(
                    `chat:${chatId}`
                ).emit(
                    "stop_typing",
                    {
                        chatId,
                        userId
                    }
                );

            }
        );


        /*
        ===================================
        SEND MESSAGE
        ===================================
        */

        socket.on(
            "send_message",
            async (
                payload,
                ack
            ) => {

                try {

                    const {
                        chatId,
                        content,
                        attachments = []
                    } = payload;

                    const message =
                        await Message.create({

                            chat: chatId,

                            sender: userId,

                            content,

                            attachments,

                            seenBy: [userId]

                        });


                    await Chat.findByIdAndUpdate(
                        chatId,
                        {
                            lastMessage: message._id,
                            lastActivity: new Date()
                        }
                    );


                    const populatedMessage =
                        await Message.findById(
                            message._id
                        )
                            .populate(
                                "sender",
                                "name role campus profileImage"
                            );


                    io.to(
                        `chat:${chatId}`
                    ).emit(
                        "receive_message",
                        populatedMessage
                    );


                    ack?.({
                        success: true,
                        data: populatedMessage
                    });

                }
                catch (error) {

                    ack?.({
                        success: false,
                        message: error.message
                    });

                }

            }
        );


        /*
        ===================================
        MESSAGE SEEN
        ===================================
        */

        socket.on(
            "message_seen",
            async ({
                messageId,
                chatId
            }) => {

                await Message.findByIdAndUpdate(
                    messageId,
                    {
                        $addToSet: {
                            seenBy: userId
                        }
                    }
                );


                io.to(
                    `chat:${chatId}`
                ).emit(
                    "message_seen",
                    {
                        messageId,
                        userId
                    }
                );

            }
        );


        /*
        ===================================
        USER OFFLINE
        ===================================
        */

        socket.on(
            "disconnect",
            () => {

                onlineUsers.delete(
                    userId
                );

                io.emit(
                    "online_users",
                    Array.from(
                        onlineUsers.keys()
                    )
                );

                console.log(
                    "Disconnected :",
                    userId
                );

            }
        );

    });

}


/*
===================================
GET IO INSTANCE
===================================
*/

export function getIO() {

    return io;

}


/*
===================================
SEND NOTIFICATION
===================================
*/

export function emitNotification(
    receiverId,
    notification
) {

    if (!io) return;

    io.to(
        `user:${receiverId}`
    ).emit(
        "new_notification",
        notification
    );

}


/*
===================================
ANNOUNCEMENT
===================================
*/

export function emitAnnouncement(
    room,
    announcement
) {

    if (!io) return;

    io.to(room).emit(
        "new_announcement",
        announcement
    );

} 

export async function notifyUser(notification) {

    if (!io) return;

    if (notification.receiver) {

        io.to(
            `user:${notification.receiver}`
        ).emit(
            "new_notification",
            notification
        );

    }

}


/*
===================================
EVENT
===================================
*/

export function emitEvent(event) {

    if (!io) return;

    // All campuses
    if (event.targetType === "ALL_CAMPUSES") {

        io.to("role:DEAN_EITP").emit(
            "new_event",
            event
        );

        io.to("role:CAMPUS_COORDINATOR").emit(
            "new_event",
            event
        );

        io.to(
            "campus:RGUKT Srikakulam:STUDENT"
        ).emit(
            "new_event",
            event
        );

        io.to(
            "campus:RGUKT Srikakulam:INTERN"
        ).emit(
            "new_event",
            event
        );

        io.to(
            "campus:RGUKT Nuzvid:STUDENT"
        ).emit(
            "new_event",
            event
        );

        io.to(
            "campus:RGUKT Nuzvid:INTERN"
        ).emit(
            "new_event",
            event
        );

        io.to(
            "campus:RGUKT Ongole:STUDENT"
        ).emit(
            "new_event",
            event
        );

        io.to(
            "campus:RGUKT Ongole:INTERN"
        ).emit(
            "new_event",
            event
        );

        io.to(
            "campus:RGUKT RK Valley:STUDENT"
        ).emit(
            "new_event",
            event
        );

        io.to(
            "campus:RGUKT RK Valley:INTERN"
        ).emit(
            "new_event",
            event
        );

        return;
    }

    // Selected campuses
    for (const campus of event.targetCampuses) {

        io.to(
            `campus:${campus}:STUDENT`
        ).emit(
            "new_event",
            event
        );

        io.to(
            `campus:${campus}:INTERN`
        ).emit(
            "new_event",
            event
        );
    }

    // Always notify Dean & Coordinators
    io.to("role:DEAN_EITP").emit(
        "new_event",
        event
    );

    io.to(
        "role:CAMPUS_COORDINATOR"
    ).emit(
        "new_event",
        event
    );

}

/*
===================================
JOB
===================================
*/

export function emitJob(job) {

    if (!io) return;

    if (job.targetType === "ALL_CAMPUSES") {

        io.to("role:DEAN_EITP").emit("new_job", job);
        io.to("role:CAMPUS_COORDINATOR").emit("new_job", job);

        [
            "RGUKT Srikakulam",
            "RGUKT Nuzvid",
            "RGUKT Ongole",
            "RGUKT RK Valley",
        ].forEach((campus) => {

            io.to(`campus:${campus}:STUDENT`).emit(
                "new_job",
                job
            );

            io.to(`campus:${campus}:INTERN`).emit(
                "new_job",
                job
            );

        });

        return;
    }
console.log("Target campuses:", job.targetCampuses);
    job.targetCampuses.forEach((campus) => {

         console.log("Emitting to:", `campus:${campus}:STUDENT`);
  console.log("Emitting to:", `campus:${campus}:INTERN`);
        io.to(`campus:${campus}:STUDENT`).emit(
            "new_job",
            job
        );

        io.to(`campus:${campus}:INTERN`).emit(
            "new_job",
            job
        );

    });

    io.to("role:DEAN_EITP").emit(
        "new_job",
        job
    );

    io.to("role:CAMPUS_COORDINATOR").emit(
        "new_job",
        job
    );

}