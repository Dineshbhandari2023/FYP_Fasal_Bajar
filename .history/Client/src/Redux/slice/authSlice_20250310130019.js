// import { createSlice } from "@reduxjs/toolkit";

// const authstore = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     isAuthenticated: false,
//   },
//   reducers: {
//     login: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//     },
//     logout: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { login, logout } = authstore.actions;
// export default authstore.reducer;

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authstore = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      // Expecting payload to be an object with user and token properties.
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Optionally, store token in localStorage for persistence.
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Remove token from localStorage.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authstore.actions;
export default authstore.reducer;
