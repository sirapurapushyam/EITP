import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  placements: [],
  stats: null,
  status: "idle",
  error: null
};

export const fetchPlacements = createAsyncThunk(
  "placements/fetchPlacements",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/placements");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load placements"
      );
    }
  }
);

export const fetchPlacementStats = createAsyncThunk(
  "placements/fetchPlacementStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/placements/stats");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load stats"
      );
    }
  }
);

export const createPlacement = createAsyncThunk(
  "placements/createPlacement",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/placements", payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create placement"
      );
    }
  }
);

export const updatePlacement = createAsyncThunk(
  "placements/updatePlacement",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/placements/${id}`, payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update placement"
      );
    }
  }
);

export const deletePlacement = createAsyncThunk(
  "placements/deletePlacement",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/placements/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete placement"
      );
    }
  }
);

const placementSlice = createSlice({
  name: "placements",
  initialState,
  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(fetchPlacements.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchPlacements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.placements = action.payload;
      })

      .addCase(fetchPlacements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchPlacementStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      .addCase(createPlacement.fulfilled, (state, action) => {
        state.placements.unshift(action.payload);
      })

      .addCase(updatePlacement.fulfilled, (state, action) => {

        const index = state.placements.findIndex(
          p => p._id === action.payload._id
        );

        if (index !== -1) {
          state.placements[index] = action.payload;
        }

      })

      .addCase(deletePlacement.fulfilled, (state, action) => {

        state.placements = state.placements.filter(
          p => p._id !== action.payload
        );

      });

  }
});

export default placementSlice.reducer;