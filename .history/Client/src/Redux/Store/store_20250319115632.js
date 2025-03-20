// // store.js
// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "../slice/userSlice";
// import productsReducer from "../slice/productSlice";
// import ordersReducer from "../slice/orderSlice";

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//     products: productsReducer,
//     orders: ordersReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // to handle non-serializable data like FormData if necessary
//     }),
//   devTools: process.env.NODE_ENV !== "production",
// });

// export default store;

// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../slice/userSlice";
import productsReducer from "../slice/productSlice";
import ordersReducer from "../slice/orderSlice";
import { combineReducers } from "redux";

// Persist Config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Persist only user slice; add more slices if needed
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  products: productsReducer,
  orders: ordersReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const rootReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistReducer(
    persistConfig,
    combineReducers({
      user: userReducer,
      products: productsReducer,
      orders: ordersReducer,
    })
  ),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
