import api from "../../api/axios";

export const getChatUsersApi = () =>
  api.get("/users/chat-users");

export const createChatApi = (
  receiverId
) =>
  api.post(
    "/chat/create",
    {
      receiverId
    }
  );

export const getChatsApi = () =>
  api.get("/chat");

export const getMessagesApi = (
  chatId
) =>
  api.get(
    `/chat/${chatId}/messages`
  );