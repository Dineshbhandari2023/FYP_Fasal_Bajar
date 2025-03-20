// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import productsReducer from "../slice/productSlice";
import orderReducer from "../slice/orderSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // to handle non-serializable data like FormData if necessary
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
