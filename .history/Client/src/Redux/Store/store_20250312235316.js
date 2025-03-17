// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import productReducer from "../slice/productSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
  },
});

export default store;
