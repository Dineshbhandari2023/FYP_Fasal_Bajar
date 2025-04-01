// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import productsReducer from "../slice/productSlice";
import ordersReducer from "../slice/orderSlice";
import paymentReducer from "../slice/paymentSlice";
import reviewReducer from "../slice/reviewSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    orders: ordersReducer,
    payment: paymentReducer,
    review: reviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // to handle non-serializable data like FormData if necessary
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
