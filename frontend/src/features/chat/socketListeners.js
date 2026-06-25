import React from "react";
import { getSocket } from "../../api/socket";
import toast from "react-hot-toast";
import { store } from "../../app/store";
import { Bell } from "lucide-react";

import {
  addMessage,
  setOnlineUsers,
  addTypingUser,
  removeTypingUser,
  incrementUnread
} from "./chatSlice";

import {
  addNotification
} from "../notifications/notificationsSlice";

import {
  addAnnouncement
} from "../announcements/announcementSlice";

export function initializeSocket(dispatch) {

  const socket = getSocket();

  // Remove existing listeners
  socket.off("receive_message");
  socket.off("online_users");
  socket.off("typing");
  socket.off("stop_typing");
  socket.off("new_notification");
  socket.off("new_announcement");
  socket.off("new_event");
  socket.off("new_job");

  // New message
  socket.on(
    "receive_message",
    message => {

      dispatch(
        addMessage(message)
      );

      const state = store.getState();

      // Only notify if user isn't already inside that chat
      if (
        state.chat.activeChat?._id !== message.chat
      ) {

        dispatch(
          incrementUnread(
            message.sender._id
          )
        );

        // Toast notification
        toast(
          `${message.sender.name}: ${message.content}`,
          {
            icon: "Message From",
            duration: 3000
          }
        );

        // Browser notification
        if (
          "Notification" in window &&
          Notification.permission === "granted"
        ) {

          new Notification(
            message.sender.name,
            {
              body: message.content,
              icon: "/logo.png"
            }
          );

        }

      }

    }
  );

  // Online users
  socket.on(
    "online_users",
    users => {

      dispatch(
        setOnlineUsers(users)
      );

    }
  );

  // Typing
  socket.on(
    "typing",
    payload => {

      // payload.user = {_id,name}
      if (payload.user) {

        dispatch(
          addTypingUser(
            payload.user
          )
        );

      }

    }
  );

  // Stop typing
  socket.on(
    "stop_typing",
    payload => {

      if (payload.userId) {

        dispatch(
          removeTypingUser(
            payload.userId
          )
        );

      }

    }
  );

  // Notifications
  socket.on(
    "new_notification",
    notification => {

      dispatch(
        addNotification(
          notification
        )
      );

    }
  );

  // Announcements
// Announcements
// socket.on(
//   "new_announcement",
//   announcement => {

//     dispatch(
//       addAnnouncement(
//         announcement
//       )
//     );

//     // Toast notification
//    toast.custom(() =>
//   React.createElement(
//     "div",
//     {
//       className:
//         "bg-white rounded-xl shadow-xl border px-4 py-3 flex gap-3 items-start w-96",
//     },
//     React.createElement(Bell, {
//       size: 22,
//       className: "text-blue-600 mt-0.5",
//     }),
//     React.createElement(
//       "div",
//       null,
//       React.createElement(
//         "h4",
//         {
//           className: "font-semibold text-slate-800",
//         },
//         announcement.title
//       ),
//       React.createElement(
//         "p",
//         {
//           className: "text-sm text-slate-600 mt-1",
//         },
//         announcement.message
//       )
//     )
//   ),
//   {
//     duration: 3000,
//   }
// );

//     // Browser notification
//     if (
//       "Notification" in window &&
//       Notification.permission === "granted"
//     ) {

//       new Notification(
//         announcement.title,
//         {
//           body: announcement.message,
//           icon: "/logo.png",
//         }
//       );

//     }

//   }
// );

socket.off("new_announcement");

socket.on(
  "new_announcement",
  (announcement) => {

    dispatch(
      addAnnouncement(announcement)
    );

    toast.custom(
  () =>
    React.createElement(
      "div",
      {
        className:
          "w-96 bg-white rounded-2xl shadow-xl border p-4 flex gap-3",
      },
      [
        React.createElement(
          "div",
          {
            key: "icon",
            className:
              "h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center",
          },
          React.createElement(Bell, {
            size: 20,
            className: "text-blue-600",
          })
        ),

        React.createElement(
          "div",
          {
            key: "content",
            className: "flex-1",
          },
          [
            React.createElement(
              "h4",
              {
                key: "title",
                className: "font-semibold text-slate-800",
              },
              announcement.title
            ),

            React.createElement(
              "p",
              {
                key: "message",
                className: "text-sm text-slate-500 mt-1",
              },
              announcement.message
            ),

            React.createElement(
              "div",
              {
                key: "tags",
                className: "flex gap-2 mt-2 flex-wrap",
              },
              [
                React.createElement(
                  "span",
                  {
                    key: "audience",
                    className:
                      "px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs",
                  },
                  announcement.audience.replaceAll("_", " ")
                ),

                announcement.campus
                  ? React.createElement(
                      "span",
                      {
                        key: "campus",
                        className:
                          "px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs",
                      },
                      announcement.campus
                    )
                  : null,
              ]
            ),

            React.createElement(
              "p",
              {
                key: "sender",
                className: "text-xs text-gray-400 mt-2",
              },
              `From ${announcement.sender?.name ?? ""}`
            ),
          ]
        ),
      ]
    ),
  {
    duration: 5000,
  }
);

    if (
      "Notification" in window &&
      Notification.permission === "granted"
    ) {

      new Notification(
        announcement.title,
        {
          body: `${announcement.sender?.name}\n${announcement.message}`,
          icon: "/logo.png",
        }
      );

    }

  }
);
socket.on("new_event", (event) => {

  toast.custom(() =>
    React.createElement(
      "div",
      {
        className:
          "w-96 bg-white rounded-2xl shadow-xl border p-4 flex gap-3",
      },
      [

        React.createElement(
          "div",
          {
            key: "icon",
            className:
              "h-10 w-10 rounded-full bg-green-100 flex items-center justify-center",
          },
          ""
        ),

        React.createElement(
          "div",
          {
            key: "content",
            className: "flex-1",
          },
          [

            React.createElement(
              "h4",
              {
                key: "heading",
                className: "font-semibold text-slate-800",
              },
              "New Event Posted"
            ),

            React.createElement(
              "p",
              {
                key: "title",
                className: "font-medium mt-1",
              },
              event.title
            ),

            React.createElement(
              "p",
              {
                key: "date",
                className: "text-sm text-slate-500 mt-1",
              },
              `Event Date : ${new Date(
                event.eventDate
              ).toLocaleDateString()}`
            ),

            React.createElement(
              "p",
              {
                key: "sender",
                className: "text-xs text-gray-400 mt-2",
              },
              `Posted by ${event.createdBy?.name} (${event.createdBy?.role.replaceAll("_"," ")})`
            ),

          ]
        )

      ]
    ),
    {
      duration: 5000,
    }
  );

  // Browser notification
  if (
    "Notification" in window &&
    Notification.permission === "granted"
  ) {

    new Notification(
      "New Event",
      {
        body: `${event.title}\nPosted by ${event.createdBy?.name}`,
        icon: "/logo.png",
      }
    );

  }
window.dispatchEvent(
  new CustomEvent("event-created")
);
});

socket.on("new_job", (job) => {

    toast.custom(() =>
        React.createElement(
            "div",
            {
                className:
                    "w-96 rounded-2xl border bg-white p-4 shadow-xl flex gap-3",
            },
            [

                React.createElement(
                    "div",
                    {
                        key: "icon",
                        className:
                            "h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center",
                    },
                    ""
                ),

                React.createElement(
                    "div",
                    {
                        key: "content",
                        className: "flex-1",
                    },
                    [

                        React.createElement(
                            "h4",
                            {
                                key: "heading",
                                className: "font-semibold",
                            },
                            "New Job Posted"
                        ),

                        React.createElement(
                            "p",
                            {
                                key: "company",
                                className: "font-medium mt-1",
                            },
                            job.companyName
                        ),

                        React.createElement(
                            "p",
                            {
                                key: "role",
                                className: "text-sm text-gray-600",
                            },
                            job.role
                        ),

                        React.createElement(
                            "p",
                            {
                                key: "sender",
                                className:
                                    "text-xs text-gray-400 mt-2",
                            },
                            `Posted by ${job.createdBy?.name}`
                        ),

                    ]
                ),

            ]
        ),
        {
            duration: 5000,
        }
    );

    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        new Notification(
            "New Job",
            {
                body: `${job.companyName} - ${job.role}`,
                icon: "/logo.png",
            }
        );

    }

    window.dispatchEvent(
        new CustomEvent("job-created")
    );

});
}





