import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import {
  submitIdeaApi,
  fetchMyIdeasApi,
  fetchCoordinatorIdeasApi,
  fetchDeanIdeasApi,
  fetchIdeaDetailsApi,
  coordinatorApproveApi,
  coordinatorRejectApi,
  deanApproveApi,
  deanRejectApi
} from "./incubationApi";

const initialState = {
  ideas: [],
  selectedIdea: null,
  status: "idle",
  error: null
};
export const submitIdea = createAsyncThunk(
  "incubation/submitIdea",
  async (payload, thunkAPI) => {
    try {
      const { data } = await submitIdeaApi(payload);
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);
export const fetchMyIdeas = createAsyncThunk(
  "incubation/fetchMyIdeas",
  async (_, thunkAPI) => {
    try {
      const { data } = await fetchMyIdeasApi();
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);
export const fetchCoordinatorIdeas =
createAsyncThunk(
  "incubation/fetchCoordinatorIdeas",
  async (_, thunkAPI) => {
    try {
      const { data } =
        await fetchCoordinatorIdeasApi();

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);
export const fetchDeanIdeas =
createAsyncThunk(
  "incubation/fetchDeanIdeas",
  async (_, thunkAPI) => {
    try {
      const { data } =
        await fetchDeanIdeasApi();

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);
export const fetchIdeaDetails =
createAsyncThunk(
  "incubation/fetchIdeaDetails",
  async (id, thunkAPI) => {
    try {
      const { data } =
        await fetchIdeaDetailsApi(id);

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);
export const coordinatorApprove =
createAsyncThunk(
  "incubation/coordinatorApprove",
  async ({ id, body }, thunkAPI) => {

    try {

      await coordinatorApproveApi(id, body);

      thunkAPI.dispatch(fetchCoordinatorIdeas());

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );

    }

  }
);
export const coordinatorReject =
createAsyncThunk(
  "incubation/coordinatorReject",
  async ({ id, body }, thunkAPI) => {

    try {

      await coordinatorRejectApi(id, body);

      thunkAPI.dispatch(fetchCoordinatorIdeas());

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );

    }

  }
);

export const deanApprove =
createAsyncThunk(
  "incubation/deanApprove",
  async ({ id, body }, thunkAPI) => {

    try {

      await deanApproveApi(id, body);

      thunkAPI.dispatch(fetchDeanIdeas());

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );

    }

  }
);

export const deanReject =
createAsyncThunk(
  "incubation/deanReject",
  async ({ id, body }, thunkAPI) => {

    try {

      await deanRejectApi(id, body);

      thunkAPI.dispatch(fetchDeanIdeas());

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );

    }

  }
);

const incubationSlice = createSlice({
  name: "incubation",

  initialState,

  reducers: {
    clearSelectedIdea(state) {
      state.selectedIdea = null;
    }
  },

  extraReducers: (builder) => {

    builder

      .addCase(fetchMyIdeas.fulfilled,
        (state, action) => {

          state.ideas = action.payload;

        })

      .addCase(fetchCoordinatorIdeas.fulfilled,
        (state, action) => {

          state.ideas = action.payload;

        })

      .addCase(fetchDeanIdeas.fulfilled,
        (state, action) => {

          state.ideas = action.payload;

        })

      .addCase(fetchIdeaDetails.fulfilled,
        (state, action) => {

          state.selectedIdea = action.payload;

        });

  }
});

export const {
  clearSelectedIdea
} = incubationSlice.actions;

export default incubationSlice.reducer;