import { createSlice } from "@reduxjs/toolkit";

function getStoredUser() {
  const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!stored || stored === "undefined") {
    return null;
  }
  return JSON.parse(stored);
}

function getStoredToken() {
  return (
    localStorage.getItem("token") || sessionStorage.getItem("token") || null
  );
}

const initialState = {
  token: getStoredToken(),
  user: getStoredUser(),
  isAuthenticated: !!(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  ),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
