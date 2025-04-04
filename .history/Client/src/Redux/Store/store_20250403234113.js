// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import productsReducer from "../slice/productSlice";
import ordersReducer from "../slice/orderSlice";
import paymentReducer from "../slice/paymentSlice";
import reviewReducer from "../slice/reviewSlice";
import messageReducer from "../slice/messageSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    orders: ordersReducer,
    payment: paymentReducer,
    review: reviewReducer,
    messages: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
