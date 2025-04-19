// // store.js
// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "../slice/userSlice";
// import productsReducer from "../slice/productSlice";
// import ordersReducer from "../slice/orderSlice";
// import paymentReducer from "../slice/paymentSlice";
// import reviewReducer from "../slice/reviewSlice";
// import messageReducer from "../slice/messageSlice";

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//     products: productsReducer,
//     orders: ordersReducer,
//     payment: paymentReducer,
//     review: reviewReducer,
//     messages: messageReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
//   devTools: process.env.NODE_ENV !== "production",
// });

// export default store;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import productsReducer from "../slice/productSlice";
import ordersReducer from "../slice/orderSlice";
import paymentReducer from "../slice/paymentSlice";
import reviewReducer from "../slice/reviewSlice";
import messageReducer from "../slice/messageSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// Configure persist with a key and the storage engine
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // persist the user slice (adjust as needed)
};

// Combine your reducers into a rootReducer
const rootReducer = combineReducers({
  user: userReducer,
  products: productsReducer,
  orders: ordersReducer,
  payment: paymentReducer,
  review: reviewReducer,
  messages: messageReducer,
});

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializableCheck for redux-persist related non-serializable items
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Create the persistor from the store
export const persistor = persistStore(store);
export default store;
