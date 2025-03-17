// import { createSlice } from "@reduxjs/toolkit";

// // Retrieve token and user safely from localStorage/sessionStorage
// const token =
//   localStorage.getItem("token") || sessionStorage.getItem("token") || null;

// const storedUser = localStorage.getItem("user");
// const user =
//   storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

// const initialState = {
//   token,
//   user,
//   isAuthenticated: !!(
//     localStorage.getItem("token") || sessionStorage.getItem("token")
//   ),
// };

// const authstore = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     login: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.isAuthenticated = true;

//       // Ensure we store a valid JSON string for the user
//       localStorage.setItem("token", action.payload.token);
//       sessionStorage.setItem("token", action.payload.token);
//       localStorage.setItem(
//         "user",
//         action.payload.user ? JSON.stringify(action.payload.user) : null
//       );
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;

//       localStorage.removeItem("token");
//       sessionStorage.removeItem("token");
//       localStorage.removeItem("user");
//     },
//   },
// });

// export const { login, logout } = authstore.actions;
// export default authstore.reducer;

import { createSlice } from "@reduxjs/toolkit";

const getStoredToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const getStoredUser = () => {
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");
  return user && user !== "undefined" ? JSON.parse(user) : null;
};

const initialState = {
  token: getStoredToken(),
  user: getStoredUser(),
  isAuthenticated: !!getStoredToken(),
};

const authstore = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, user, rememberMe } = action.payload;

      state.token = token;
      state.user = user;
      state.isAuthenticated = true;

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user || null));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user || null));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authstore.actions;
export default authstore.reducer;
