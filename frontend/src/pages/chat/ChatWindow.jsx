import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveChat,
  setActiveUser,
} from "../../features/chat/chatSlice";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow() {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);

  const activeChat = useSelector(
    (state) => state.chat.activeChat
  );

  const activeUser = useSelector(
    (state) => state.chat.activeUser
  );

  const messages = useSelector(
    (state) => state.chat.messages
  );

  const typingUsers = useSelector(
    (state) => state.chat.typingUsers
  );

  const onlineUsers = useSelector(
    (state) => state.chat.onlineUsers
  );

  const currentUser = useSelector(
    (state) => state.auth.user
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typingUsers]);

  if (!activeChat) {
    return (
      <div className="h-full bg-white rounded-xl lg:rounded-2xl shadow-md flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  const isOnline =
    activeUser &&
    onlineUsers.includes(activeUser._id);

  return (
    <div className="h-full bg-white rounded-xl lg:rounded-2xl shadow-md flex flex-col overflow-hidden">

      {/* Header */}
      <div className="border-b bg-white px-3 sm:px-5 py-3 sm:py-4 flex items-center gap-3 shrink-0">

        {/* Mobile Back Button */}
        <button
          className="lg:hidden p-1 rounded-full hover:bg-gray-100"
          onClick={() => {
            dispatch(setActiveChat(null));
            dispatch(setActiveUser(null));
          }}
        >
          <ArrowLeft size={22} />
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">

          <div
            className="
              h-10
              w-10
              sm:h-12
              sm:w-12
              rounded-full
              bg-blue-600
              text-white
              flex
              items-center
              justify-center
              font-bold
            "
          >
            {activeUser?.name?.charAt(0)?.toUpperCase()}
          </div>

          {isOnline && (
            <div
              className="
                absolute
                bottom-0
                right-0
                h-3
                w-3
                rounded-full
                bg-green-500
                border-2
                border-white
              "
            />
          )}

        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">

          <div className="font-semibold text-gray-800 truncate">
            {activeUser?.name}
          </div>

          <div className="text-xs sm:text-sm text-gray-500 truncate">
            {typingUsers.length > 0
              ? `${typingUsers[0]?.name} is typing...`
              : isOnline
              ? "Online"
              : activeUser?.role}
          </div>

        </div>

      </div>

      {/* Messages */}
      <div
        className="
          flex-1
          min-h-0
          overflow-y-auto
          bg-slate-50
          p-3
          sm:p-5
          space-y-4
        "
      >
        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            mine={
              message.sender._id === currentUser._id
            }
          />
        ))}

        {typingUsers.length > 0 && (
          <TypingIndicator
            userName={typingUsers[0]?.name}
          />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0">
        <MessageInput
          chatId={activeChat._id}
        />
      </div>

    </div>
  );
}