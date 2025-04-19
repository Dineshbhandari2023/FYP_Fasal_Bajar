import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./axiosInstance";

const initialState = {
  userInfo: null,
  usersList: [],
  farmersList: [],
  suppliersList: [],
  accessToken: localStorage.getItem("accessToken") || null,
  loading: false,
  error: null,
  isAuthChecked: false,
  message: null,
};

// Login User
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const { data } = await axios.post("/users/login", { email, password });
      localStorage.setItem("accessToken", data.Result.accessToken);
      return data.Result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Register User
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, thunkAPI) => {
    try {
      const { data } = await axios.post("/users/register", userData);
      return data.Result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Register Supplier User
export const registerSupplierUser = createAsyncThunk(
  "user/registerSupplierUser",
  async (userData, thunkAPI) => {
    try {
      const { data } = await axios.post("/users/register/supplier", userData);
      return data.Result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Fetch Current User
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const response = await axios.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("/users");
      return data.Result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Fetch all farmers
export const fetchFarmers = createAsyncThunk(
  "user/fetchFarmers",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("/users/farmers");
      return data.Result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Fetch all suppliers
export const fetchSuppliers = createAsyncThunk(
  "user/fetchSuppliers",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("/users/suppliers");
      return data.Result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    try {
      await axios.post("/users/logout");
      localStorage.removeItem("accessToken");
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user profile
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (updateData, thunkAPI) => {
    try {
      const { accessToken } = thunkAPI.getState().user;
      const response = await axios.put("/users", updateData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.Result.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.token;
      state.userInfo = action.payload.user;
      state.error = null;
      state.isAuthChecked = true;
    },
    logout: (state) => {
      state.userInfo = null;
      state.accessToken = null;
      state.error = null;
      state.isAuthChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
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
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user_data;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload is the user object from response.data.user
        state.userInfo = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthChecked = true;
      })

      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all farmers
      .addCase(fetchFarmers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmers.fulfilled, (state, action) => {
        state.loading = false;
        state.farmersList = action.payload;
      })
      .addCase(fetchFarmers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.userInfo = null;
        state.accessToken = null;
      })

      // Update User
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
        state.error = action.payload;
      });
  },
});

export const selectIsAuthenticated = (state) => Boolean(state.user.accessToken);
export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
