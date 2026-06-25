import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios.js';

const initialState = {
  items: [],
  status: 'idle',
  error: null
};

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/notifications');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load notifications');
  }
});

export const markNotificationRead = createAsyncThunk('notifications/markNotificationRead', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update notification');
  }
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
    addNotification(state, action) {

    state.items.unshift(action.payload);

  }

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.items = state.items.map((item) => (item._id === updated._id ? updated : item));
      });
  }
});

export const {
  clearNotifications,
  addNotification
} = notificationsSlice.actions;
export const selectNotifications = (state) => state.notifications.items;
export default notificationsSlice.reducer;
