import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getAnnouncementsApi,
} from "./announcementApi";

const initialState = {
  items: [],
  latestAnnouncement: null,
  status: "idle",
  error: null,
};

/**
 * Fetch announcements
 */
export const fetchAnnouncements =
  createAsyncThunk(
    "announcements/fetch",
    async (_, { rejectWithValue }) => {
      try {
        const { data } =
          await getAnnouncementsApi();

        return data.data;
      } catch (err) {
        return rejectWithValue(
          err.response?.data?.message ||
            "Failed to fetch announcements."
        );
      }
    }
  );

const announcementSlice = createSlice({
  name: "announcements",

  initialState,

  reducers: {
    /**
     * Socket event
     */
    addAnnouncement(state, action) {
      const exists = state.items.some(
        (item) => item._id === action.payload._id
      );

      if (!exists) {
        state.items.unshift(action.payload);
      }

      state.latestAnnouncement =
        action.payload;
    },

    /**
     * Clear latest announcement
     */
    clearLatestAnnouncement(state) {
      state.latestAnnouncement = null;
    },

    /**
     * Remove after delete/dismiss
     */
    removeAnnouncement(state, action) {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },

    /**
     * Add immediately after sender creates
     */
    prependAnnouncement(state, action) {
      state.items.unshift(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchAnnouncements.pending,
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )

      .addCase(
        fetchAnnouncements.fulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )

      .addCase(
        fetchAnnouncements.rejected,
        (state, action) => {
          state.status = "failed";
          state.error =
            action.payload ||
            "Something went wrong.";
        }
      );
  },
});

export const {
  addAnnouncement,
  prependAnnouncement,
  removeAnnouncement,
  clearLatestAnnouncement,
} = announcementSlice.actions;

export default announcementSlice.reducer;