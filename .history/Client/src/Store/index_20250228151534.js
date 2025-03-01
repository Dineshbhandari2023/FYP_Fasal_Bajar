import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";

const index = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default index;
