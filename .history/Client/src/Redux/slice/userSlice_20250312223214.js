// slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for logging in a user
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });
      // Assuming your API response structure contains Result with accessToken and user_data
      return response.data.Result;
    } catch (error) {
      // Extract a useful error message from response if available
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Similarly, add async thunks for registration, fetching current user, etc.
// export const registerUser = createAsyncThunk('user/registerUser', async (...), thunkAPI => {...});

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    accessToken: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.accessToken = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user_data;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to login";
      });
    // You can add additional cases for registerUser, fetchCurrentUser, etc.
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
