import {
  createSlice,
  createAsyncThunk
} from "@reduxjs/toolkit";

import {
  getChatsApi,
  getMessagesApi,
  getChatUsersApi
} from "./chatApi";

const initialState = {
  chats: [],
  chatUsers: [],
  activeChat: null,
  activeUser: null,
  messages: [],
  onlineUsers: [],
  typingUsers: [],
  unreadCounts: {}
};

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async () => {
    const { data } = await getChatsApi();
    return data.data;
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (chatId) => {
    const { data } = await getMessagesApi(chatId);
    return data.data;
  }
);

export const fetchChatUsers = createAsyncThunk(
  "chat/fetchChatUsers",
  async () => {
    const { data } = await getChatUsersApi();
    return data.data;
  }
);

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    setActiveChat(state, action) {
      state.activeChat = action.payload;
    },

    setActiveUser(state, action) {
      state.activeUser = action.payload;
    },

    addMessage(state, action) {
      state.messages.push(action.payload);
    },

    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },

    addTypingUser(state, action) {
      const exists = state.typingUsers.find(
        user => user._id === action.payload._id
      );

      if (!exists) {
        state.typingUsers.push(action.payload);
      }
    },

    removeTypingUser(state, action) {
      state.typingUsers =
        state.typingUsers.filter(
          user => user._id !== action.payload
        );
    },

    incrementUnread(state, action) {
      const userId = action.payload;

      state.unreadCounts[userId] =
        (state.unreadCounts[userId] || 0) + 1;
    },

    clearUnread(state, action) {
      state.unreadCounts[action.payload] = 0;
    }
  },

  extraReducers: (builder) => {

    builder

      .addCase(
        fetchChats.fulfilled,
        (state, action) => {
          state.chats = action.payload;
        }
      )

      .addCase(
        fetchMessages.fulfilled,
        (state, action) => {
          state.messages = action.payload;
        }
      )

      .addCase(
        fetchChatUsers.fulfilled,
        (state, action) => {
          state.chatUsers = action.payload;
        }
      );

  }

});

export const {
  setActiveChat,
  setActiveUser,
  addMessage,
  setOnlineUsers,
  addTypingUser,
  removeTypingUser,
  incrementUnread,
  clearUnread
} = chatSlice.actions;

export default chatSlice.reducer;