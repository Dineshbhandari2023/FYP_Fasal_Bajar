import { createSlice } from "@reduxjs/toolkit";

const authstore = createSlice({
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authstore.actions;
export default authstore.reducer;
