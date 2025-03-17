import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import ApiLink from "../../api";

// Async thunk for logging in a user
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        ApiLink.login.url,
        { email, password },
        { withCredentials: true }
      );
      // Assuming your API response structure contains Result with accessToken and user_data
      return response.data.Result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Async thunk for registering a new user
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(ApiLink.register.url, userData, {
        withCredentials: true,
      });
      return response.data.Result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Async thunk for fetching the current user
// export const fetchCurrentUser = createAsyncThunk(
//   "user/fetchCurrentUser",
//   async (_, thunkAPI) => {
//     try {
//       // Since ApiLink doesn't define a "current user" endpoint,
//       // we construct it based on the getAllUsers endpoint.
//       const url = `${ApiLink.getAllUsers.url}`;
//       const response = await axios.get(url, { withCredentials: true });
//       // Expecting response.data.user based on your controller
//       return response.data.user;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.ErrorMessage || error.message
//       );
//     }
//   }
// );

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/users", { withCredentials: true });

      // If 304, the server says “no change” – so we can skip overwriting Redux.
      // We can return the existing user from the state or do nothing.
      if (response.status === 304) {
        // Return the current user already in the state
        const currentUser = thunkAPI.getState().user.userInfo;
        return currentUser || null;
      }

      // Otherwise, typical case:
      return response.data.user; // or response.data.Result.user, etc.
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Async thunk for updating the user profile
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (updateData, thunkAPI) => {
    try {
      // The update endpoint is defined as PUT on /users in your controller.
      const response = await axios.put(ApiLink.getAllUsers.url, updateData, {
        withCredentials: true,
      });
      // Assuming your API returns the updated user data in Result.user
      return response.data.Result.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Async thunk for forgot password
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(
        ApiLink.forgotPassword.url,
        { email },
        { withCredentials: true }
      );
      // Return the success message from the API
      return response.data.Result.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Async thunk for verifying reset code
export const verifyResetCode = createAsyncThunk(
  "user/verifyResetCode",
  async (resetCode, thunkAPI) => {
    try {
      const response = await axios.post(
        ApiLink.verifyResetCode.url,
        { resetCode },
        { withCredentials: true }
      );
      return response.data.Result.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Async thunk for resetting the password
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ resetCode, newPassword }, thunkAPI) => {
    try {
      const response = await axios.post(
        ApiLink.resetPassword.url,
        { resetCode, newPassword },
        { withCredentials: true }
      );
      return response.data.Result.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    accessToken: null,
    loading: false,
    error: null,
    isAuthChecked: false,
  },
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.token;
      state.userInfo = action.payload.user;
      state.error = null;
      state.isAuthChecked = true; // <-- SET WHEN AUTH IS CHECKED
    },
    logout: (state) => {
      state.userInfo = null;
      state.accessToken = null;
      state.error = null;
      state.isAuthChecked = true; // <-- Auth checked, but no user
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
      })
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user_data;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to register";
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.userInfo = action.payload;
      // })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        // If action.payload is null, do NOT overwrite user state
        if (action.payload) {
          state.userInfo = action.payload;
        }
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch current user";
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
      })
      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to process forgot password";
      })
      // Verify reset code
      .addCase(verifyResetCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetCode.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(verifyResetCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to verify reset code";
      })
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to reset password";
      });
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
