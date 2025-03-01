import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authstore";

const index = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default index;
