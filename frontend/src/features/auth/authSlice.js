import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios.js';

const initialState = {
  user: null,
  accessToken: localStorage.getItem('eitp_access_token') || null,
  status: 'idle',
  error: null,
  initialized: false
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials);

      return {
        user: data.user,
        accessToken: data.accessToken
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', payload);

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me');

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Session expired'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    hydrateAuth(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.error = null;

      if (action.payload.accessToken) {
        localStorage.setItem(
          'eitp_access_token',
          action.payload.accessToken
        );
      }
    },

    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.status = 'idle';
      state.error = null;

      localStorage.removeItem('eitp_access_token');
    }
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;

        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;

        localStorage.setItem(
          'eitp_access_token',
          action.payload.accessToken
        );
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
  state.status = 'succeeded';
  state.user = action.payload;
  state.initialized = true;
})

     .addCase(fetchCurrentUser.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.payload;
  state.user = null;
  state.initialized = true;
})

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = 'idle';
        state.error = null;

        localStorage.removeItem('eitp_access_token');
      });
  }
});

export const { hydrateAuth, clearAuth } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.accessToken;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthInitialized =
  (state) => state.auth.initialized;

export default authSlice.reducer;