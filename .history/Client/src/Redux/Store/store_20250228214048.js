import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authstore";

const store = configureStore({
  reducer: {
    user: authReducer,
  },
});

export default store;
