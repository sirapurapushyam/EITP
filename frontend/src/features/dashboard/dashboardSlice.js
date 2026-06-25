import {
  createSlice,
  createAsyncThunk
} from "@reduxjs/toolkit";

import {
  fetchDeanDashboardApi,
  fetchCoordinatorDashboardApi,
  fetchStudentDashboardApi,
  fetchInternDashboardApi
} from "./dashboardApi";

export const fetchDeanDashboard =
  createAsyncThunk(
    "dashboard/dean",
    async (_, thunkAPI) => {
      try {
        const res =
          await fetchDeanDashboardApi();

        return res.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message
        );
      }
    }
  );

export const fetchCoordinatorDashboard =
  createAsyncThunk(
    "dashboard/coordinator",
    async (_, thunkAPI) => {
      try {
        const res =
          await fetchCoordinatorDashboardApi();

        return res.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message
        );
      }
    }
  );

export const fetchStudentDashboard =
  createAsyncThunk(
    "dashboard/student",
    async (_, thunkAPI) => {
      try {
        const res =
          await fetchStudentDashboardApi();

        return res.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message
        );
      }
    }
  );

export const fetchInternDashboard =
  createAsyncThunk(
    "dashboard/intern",
    async (_, thunkAPI) => {
      try {
        const res =
          await fetchInternDashboardApi();

        return res.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message
        );
      }
    }
  );

const initialState = {
  data: null,
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {
    clearDashboard: state => {
      state.data = null;
    }
  },

  extraReducers: builder => {

    builder
      .addMatcher(
        action =>
          action.type.startsWith("dashboard/") &&
          action.type.endsWith("/pending"),

        state => {
          state.loading = true;
          state.error = null;
        }
      )

      .addMatcher(
        action =>
          action.type.startsWith("dashboard/") &&
          action.type.endsWith("/fulfilled"),

        (state, action) => {
          state.loading = false;
          state.data = action.payload;
        }
      )

      .addMatcher(
        action =>
          action.type.startsWith("dashboard/") &&
          action.type.endsWith("/rejected"),

        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

  }
});

export const {
  clearDashboard
} = dashboardSlice.actions;

export default dashboardSlice.reducer;