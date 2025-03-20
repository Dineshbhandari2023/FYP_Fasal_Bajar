import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./axiosInstance";

const initialState = {
  orders: [],
  stats: {},
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
      // Assuming the API returns the new order under "order" key
      return response.data.Result.order;
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
      // Assuming the orders array is returned under "orders"
      return response.data.Result.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Update order status (e.g., for buyers to cancel or for farmers to mark as shipped)
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
      // Assuming the updated order is returned under "order"
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
      // Assuming the stats are returned under "Result"
      return response.data.Result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Optionally add synchronous reducers here if needed
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
        // Add new order to orders array
        state.orders.push(action.payload);
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

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Replace updated order in the orders array
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update order item status (this thunk can update a part of an order)
      .addCase(updateOrderItemStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderItemStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Depending on your data structure, you might update the specific order item here.
        // For example, loop through orders and update the matching order item.
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
      });
  },
});

export default orderSlice.reducer;
