import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get API URL from environment variable
const API_URL = "http://localhost:8000";

// Get auth token from localStorage
// const getAuthToken = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   return user?.token;
// };
const getAuthToken = () => {
  return (
    localStorage.getItem("accessToken") ||
    JSON.parse(localStorage.getItem("user"))?.token ||
    null
  );
};

// Async thunks for API calls
export const getSupplierDetails = createAsyncThunk(
  "supplier/getDetails",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      const { data } = await axios.get(`${API_URL}/api/supplier/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // data.Result.data is the full userData { ..., SupplierDetail, deliveryStats }
      return data.Result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Registers new SupplierDetails
export const registerSupplierDetails = createAsyncThunk(
  "supplier/register",
  async (formData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      const { data } = await axios.post(
        `${API_URL}/api/supplier/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // data.Result.data is the newly-created SupplierDetails record
      return data.Result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Updates existing SupplierDetails
export const updateSupplierDetails = createAsyncThunk(
  "supplier/update",
  async (formData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      const { data } = await axios.put(
        `${API_URL}/api/supplier/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data.Result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

export const updateCurrentLocation = createAsyncThunk(
  "supplier/updateLocation",
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      const response = await axios.put(
        `${API_URL}/api/supplier/location`,
        { latitude, longitude },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.Result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage ||
          error.message ||
          "Failed to update location"
      );
    }
  }
);

export const getActiveDeliveries = createAsyncThunk(
  "supplier/activeDeliveries",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      const response = await axios.get(
        `${API_URL}/api/supplier/deliveries/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.Result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage ||
          error.message ||
          "Failed to fetch active deliveries"
      );
    }
  }
);

export const getDeliveryHistory = createAsyncThunk(
  "supplier/deliveryHistory",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      const response = await axios.get(
        `${API_URL}/api/supplier/deliveries/history`,
        {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        deliveries: response.data.Result.data,
        pagination: response.data.Result.pagination,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage ||
          error.message ||
          "Failed to fetch delivery history"
      );
    }
  }
);

export const getAvailableDeliveries = createAsyncThunk(
  "supplier/availableDeliveries",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      const response = await axios.get(
        `${API_URL}/api/supplier/deliveries/available`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.Result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage ||
          error.message ||
          "Failed to fetch available deliveries"
      );
    }
  }
);

export const acceptDelivery = createAsyncThunk(
  "supplier/acceptDelivery",
  async (orderItemId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      const response = await axios.post(
        `${API_URL}/api/supplier/deliveries/accept`,
        { orderItemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.Result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage ||
          error.message ||
          "Failed to accept delivery"
      );
    }
  }
);

export const updateDeliveryStatus = createAsyncThunk(
  "supplier/updateDeliveryStatus",
  async (
    { deliveryId, status, notes, proofOfDelivery },
    { rejectWithValue }
  ) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      const formData = new FormData();
      formData.append("deliveryId", deliveryId);
      formData.append("status", status);
      if (notes) formData.append("notes", notes);
      if (proofOfDelivery) formData.append("proofOfDelivery", proofOfDelivery);

      const response = await axios.put(
        `${API_URL}/api/supplier/deliveries/status`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.Result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage ||
          error.message ||
          "Failed to update delivery status"
      );
    }
  }
);

// Initial state
const initialState = {
  supplierDetails: null,
  activeDeliveries: [],
  deliveryHistory: [],
  availableDeliveries: [],
  pagination: {
    totalDeliveries: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 0,
  },
  loading: false,
  error: null,
  success: false,
  message: "",
};

// Supplier slice
const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = "";
    },
    resetSupplierState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get supplier details
      .addCase(getSupplierDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSupplierDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        // pull only the SupplierDetail out of the userData
        state.supplierDetails = payload.SupplierDetail;
        state.success = true;
      })
      .addCase(getSupplierDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Register supplier
      .addCase(registerSupplierDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerSupplierDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.supplierDetails = payload; // now a real object
        state.success = true;
        state.message = "Supplier profile registered successfully";
      })
      .addCase(registerSupplierDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Update supplier details
      .addCase(updateSupplierDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupplierDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.supplierDetails = payload;
        state.success = true;
        state.message = "Supplier profile updated successfully";
      })
      .addCase(updateSupplierDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Update location
      .addCase(updateCurrentLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCurrentLocation.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.message = "Location updated successfully";
      })
      .addCase(updateCurrentLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get active deliveries
      .addCase(getActiveDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.activeDeliveries = action.payload;
      })
      .addCase(getActiveDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get delivery history
      .addCase(getDeliveryHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeliveryHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryHistory = action.payload.deliveries;
        state.pagination = action.payload.pagination;
      })
      .addCase(getDeliveryHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get available deliveries
      .addCase(getAvailableDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.availableDeliveries = action.payload;
      })
      .addCase(getAvailableDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Accept delivery
      .addCase(acceptDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.activeDeliveries = [...state.activeDeliveries, action.payload];
        state.success = true;
        state.message = "Delivery accepted successfully";
      })
      .addCase(acceptDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update delivery status
      .addCase(updateDeliveryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        state.loading = false;

        // Update the delivery in activeDeliveries array
        const updatedDelivery = action.payload;

        // If delivery is completed (Delivered, Failed, Cancelled), remove from active and add to history
        if (
          ["Delivered", "Failed", "Cancelled"].includes(updatedDelivery.status)
        ) {
          state.activeDeliveries = state.activeDeliveries.filter(
            (delivery) => delivery.id !== updatedDelivery.id
          );
          state.deliveryHistory = [updatedDelivery, ...state.deliveryHistory];
        } else {
          // Otherwise just update the status in the active deliveries
          state.activeDeliveries = state.activeDeliveries.map((delivery) =>
            delivery.id === updatedDelivery.id ? updatedDelivery : delivery
          );
        }

        state.success = true;
        state.message = "Delivery status updated successfully";
      })
      .addCase(updateDeliveryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetSupplierState } =
  supplierSlice.actions;
export default supplierSlice.reducer;
