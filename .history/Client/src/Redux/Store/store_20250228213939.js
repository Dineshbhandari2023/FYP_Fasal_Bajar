import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authstore";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
