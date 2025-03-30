// // orderSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "./axiosInstance";

// const initialState = {
//   orders: [],
//   stats: {},
//   pendingItems: [],
//   selectedOrder: null,
//   loading: false,
//   error: null,
// };

// // Create a new order
// export const createOrder = createAsyncThunk(
//   "orders/createOrder",
//   async (orderData, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().user.accessToken;
//       const response = await axios.post("/orders", orderData, {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });
//       return response.data.Result.order;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.ErrorMessage || error.message
//       );
//     }
//   }
// );

// // Fetch orders for the current user
// export const fetchMyOrders = createAsyncThunk(
//   "orders/fetchMyOrders",
//   async (_, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().user.accessToken;
//       const response = await axios.get("/orders/myorders", {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });
//       return response.data.Result.orders;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.ErrorMessage || error.message
//       );
//     }
//   }
// );

// // Get a specific order by ID
// export const getOrderById = createAsyncThunk(
//   "orders/getOrderById",
//   async (orderId, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().user.accessToken;
//       const response = await axios.get(`/orders/${orderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });
//       return response.data.Result.order;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.ErrorMessage || error.message
//       );
//     }
//   }
// );

// // Update order status (e.g., cancel or mark as shipped)
// export const updateOrderStatus = createAsyncThunk(
//   "orders/updateOrderStatus",
//   async ({ orderId, status }, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().user.accessToken;
//       const response = await axios.patch(
//         `/orders/${orderId}/status`,
//         { status },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       return response.data.Result.order;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.ErrorMessage || error.message
//       );
//     }
//   }
// );

// // Update order item status (for farmers to accept/decline an item)
// export const updateOrderItemStatus = createAsyncThunk(
//   "orders/updateOrderItemStatus",
//   async ({ itemId, status, farmerNotes }, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().user.accessToken;
//       const response = await axios.patch(
//         `/orders/items/${itemId}/status`,
//         { status, farmerNotes },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       // Return the updated order item data
//       return response.data.Result.orderItem;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.ErrorMessage || error.message
//       );
//     }
//   }
// );

// // Fetch order statistics (for farmer dashboard)
// export const fetchOrderStats = createAsyncThunk(
//   "orders/fetchOrderStats",
//   async (_, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().user.accessToken;
//       const response = await axios.get("/orders/stats", {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });
//       return response.data.Result;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.ErrorMessage || error.message
//       );
//     }
//   }
// );

// // Fetch pending order items for a farmer
// export const fetchPendingOrderItems = createAsyncThunk(
//   "orders/fetchPendingOrderItems",
//   async (_, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().user.accessToken;
//       const response = await axios.get("/orders/pending-items", {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });
//       return response.data.Result.pendingItems;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.ErrorMessage || error.message
//       );
//     }
//   }
// );

// const orderSlice = createSlice({
//   name: "orders",
//   initialState,
//   reducers: {
//     // Optionally add synchronous reducers here if needed
//     clearSelectedOrder(state) {
//       state.selectedOrder = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create order
//       .addCase(createOrder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders.push(action.payload);
//       })
//       .addCase(createOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch my orders
//       .addCase(fetchMyOrders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMyOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = action.payload;
//       })
//       .addCase(fetchMyOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Get order by ID
//       .addCase(getOrderById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getOrderById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedOrder = action.payload;
//       })
//       .addCase(getOrderById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Update order status
//       .addCase(updateOrderStatus.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateOrderStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = state.orders.map((order) =>
//           order.id === action.payload.id ? action.payload : order
//         );
//       })
//       .addCase(updateOrderStatus.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Update order item status
//       .addCase(updateOrderItemStatus.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateOrderItemStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         // Loop through orders to update the specific order item
//         state.orders.forEach((order) => {
//           // Update in "OrderItems" array if exists
//           if (order.OrderItems) {
//             order.OrderItems = order.OrderItems.map((item) =>
//               item.id === action.payload.id
//                 ? { ...item, ...action.payload }
//                 : item
//             );
//           }
//           // Or in "items" array if that's your structure
//           if (order.items) {
//             order.items = order.items.map((item) =>
//               item.id === action.payload.id
//                 ? { ...item, ...action.payload }
//                 : item
//             );
//           }
//         });
//       })
//       .addCase(updateOrderItemStatus.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch order stats
//       .addCase(fetchOrderStats.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchOrderStats.fulfilled, (state, action) => {
//         state.loading = false;
//         state.stats = action.payload;
//       })
//       .addCase(fetchOrderStats.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch pending order items
//       .addCase(fetchPendingOrderItems.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPendingOrderItems.fulfilled, (state, action) => {
//         state.loading = false;
//         state.pendingItems = action.payload;
//       })
//       .addCase(fetchPendingOrderItems.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearSelectedOrder } = orderSlice.actions;
// export default orderSlice.reducer;

// orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./axiosInstance";

const initialState = {
  orders: [],
  stats: {},
  pendingItems: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

// Create a new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const response = await axios.post("/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      // Return the entire Result object so we can access paymentUrl or other fields
      return response.data.Result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Fetch orders for the current user
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const response = await axios.get("/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      return response.data.Result.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Get a specific order by ID
export const getOrderById = createAsyncThunk(
  "orders/getOrderById",
  async (orderId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const response = await axios.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      return response.data.Result.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Update order status (e.g., cancel or mark as shipped)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const response = await axios.patch(
        `/orders/${orderId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      return response.data.Result.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Update order item status (for farmers to accept/decline an item)
export const updateOrderItemStatus = createAsyncThunk(
  "orders/updateOrderItemStatus",
  async ({ itemId, status, farmerNotes }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const response = await axios.patch(
        `/orders/items/${itemId}/status`,
        { status, farmerNotes },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      // Return the updated order item data
      return response.data.Result.orderItem;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Fetch order statistics (for farmer dashboard)
export const fetchOrderStats = createAsyncThunk(
  "orders/fetchOrderStats",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const response = await axios.get("/orders/stats", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      return response.data.Result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Fetch pending order items for a farmer
export const fetchPendingOrderItems = createAsyncThunk(
  "orders/fetchPendingOrderItems",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const response = await axios.get("/orders/pending-items", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      return response.data.Result.pendingItems;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        /**
         * action.payload is the entire 'Result' object from the server.
         * e.g. { message, order, paymentUrl, items, ... }
         * If there's an 'order' field, we can push it into state.orders
         */
        const { order } = action.payload;
        if (order) {
          state.orders.push(order);
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch my orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get order by ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update order item status
      .addCase(updateOrderItemStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderItemStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Loop through orders to update the specific order item
        state.orders.forEach((order) => {
          // If your backend returns 'OrderItems'
          if (order.OrderItems) {
            order.OrderItems = order.OrderItems.map((item) =>
              item.id === action.payload.id
                ? { ...item, ...action.payload }
                : item
            );
          }
          // Or if your backend returns 'items'
          if (order.items) {
            order.items = order.items.map((item) =>
              item.id === action.payload.id
                ? { ...item, ...action.payload }
                : item
            );
          }
        });
      })
      .addCase(updateOrderItemStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch order stats
      .addCase(fetchOrderStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchOrderStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch pending order items
      .addCase(fetchPendingOrderItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingOrderItems.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingItems = action.payload;
      })
      .addCase(fetchPendingOrderItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
