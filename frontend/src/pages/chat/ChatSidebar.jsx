import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatUsers,
  fetchMessages,
  setActiveChat,
  setActiveUser,
  clearUnread,
} from "../../features/chat/chatSlice";
import { createChatApi } from "../../features/chat/chatApi";
import { getSocket } from "../../api/socket";

export default function ChatSidebar() {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.chat.chatUsers);
  const activeUser = useSelector((state) => state.chat.activeUser);
  const onlineUsers = useSelector((state) => state.chat.onlineUsers);
  const unreadCounts = useSelector((state) => state.chat.unreadCounts);

  useEffect(() => {
    dispatch(fetchChatUsers());
  }, [dispatch]);

  async function openChat(user) {
    try {
      const { data } = await createChatApi(user._id);

      const chat = data.data;

      dispatch(setActiveChat(chat));
      dispatch(setActiveUser(user));
      dispatch(clearUnread(user._id));
      dispatch(fetchMessages(chat._id));

      getSocket().emit("join_chat", chat._id);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="h-full bg-white rounded-xl lg:rounded-2xl shadow-md flex flex-col overflow-hidden">

      {/* Header */}
      <div className="border-b p-4 shrink-0">
        <h2 className="text-lg sm:text-xl font-bold">
          Chats
        </h2>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">

        {users.map((user) => {
          const isActive = activeUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);

          return (
            <button
              key={user._id}
              onClick={() => openChat(user)}
              className={`w-full border-b p-3 sm:p-4 text-left transition ${
                isActive
                  ? "bg-blue-50 border-l-4 border-blue-600"
                  : "hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">

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
                    {user.name?.charAt(0)?.toUpperCase()}
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
                    {user.name}
                  </div>

                  <div className="text-xs sm:text-sm text-gray-500 truncate">
                    {user.role}
                  </div>

                  {user.lastMessage && (
                    <div className="text-xs text-gray-400 truncate mt-1">
                      {user.lastMessage}
                    </div>
                  )}
                </div>

                {/* Unread Count */}
                {unreadCounts[user._id] > 0 && (
                  <div
                    className="
                      ml-2
                      min-w-[22px]
                      h-6
                      px-2
                      rounded-full
                      bg-red-500
                      text-white
                      text-xs
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    {unreadCounts[user._id]}
                  </div>
                )}

              </div>
            </button>
          );
        })}

        {users.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No chats found
          </div>
        )}

      </div>
    </div>
  );
}