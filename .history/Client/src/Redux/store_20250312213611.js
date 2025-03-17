import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Redux/slice/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
