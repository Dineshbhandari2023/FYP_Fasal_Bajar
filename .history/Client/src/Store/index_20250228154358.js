import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authstore.reducer";

const index = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default index;
