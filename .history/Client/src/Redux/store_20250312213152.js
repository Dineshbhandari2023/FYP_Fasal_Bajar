import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer";
import authReducer from "./reducers/authReducer";

const store = configureStore({
  auth: authReducer,
});

export default store;
