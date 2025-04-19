import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./axiosInstance";

const initialState = {
  supplierDetails: null,
  availableDeliveries: [],
  activeDeliveries: [],
  deliveryHistory: [],
  loading: false,
  error: null,
  message: null,
};

// Register supplier details
export const registerSupplierDetails = createAsyncThunk(
  "supplier/registerDetails",
  async (supplierData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const { data } = await axios.post("/suppliers/register", supplierData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return data.Result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Update supplier details
export const updateSupplierDetails = createAsyncThunk(
  "supplier/updateDetails",
  async (updateData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const { data } = await axios.put("/suppliers/update", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return data.Result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Update current location
export const updateCurrentLocation = createAsyncThunk(
  "supplier/updateLocation",
  async ({ latitude, longitude }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const { data } = await axios.put(
        "/suppliers/location",
        { latitude, longitude },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { latitude, longitude };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Get available deliveries
export const getAvailableDeliveries = createAsyncThunk(
  "supplier/getAvailableDeliveries",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const { data } = await axios.get("/suppliers/deliveries/available", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.Result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Accept a delivery
export const acceptDelivery = createAsyncThunk(
  "supplier/acceptDelivery",
  async (orderItemId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const { data } = await axios.post(
        "/suppliers/deliveries/accept",
        { orderItemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.Result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Update delivery status
export const updateDeliveryStatus = createAsyncThunk(
  "supplier/updateDeliveryStatus",
  async ({ deliveryId, status, notes, proofOfDelivery }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;

      // Create FormData if there's a file to upload
      let requestData;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (proofOfDelivery) {
        requestData = new FormData();
        requestData.append("deliveryId", deliveryId);
        requestData.append("status", status);
        if (notes) requestData.append("notes", notes);
        requestData.append("proofOfDelivery", proofOfDelivery);
        headers["Content-Type"] = "multipart/form-data";
      } else {
        requestData = { deliveryId, status, notes };
      }

      const { data } = await axios.put(
        "/suppliers/deliveries/status",
        requestData,
        {
          headers,
        }
      );

      return data.Result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Get active deliveries
export const getActiveDeliveries = createAsyncThunk(
  "supplier/getActiveDeliveries",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const { data } = await axios.get("/suppliers/deliveries/active", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.Result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Get delivery history
export const getDeliveryHistory = createAsyncThunk(
  "supplier/getDeliveryHistory",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const { data } = await axios.get(
        `/suppliers/deliveries/history?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.Result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Get supplier details
export const getSupplierDetails = createAsyncThunk(
  "supplier/getDetails",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const { data } = await axios.get("/suppliers/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.Result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    clearSupplierState: (state) => {
      state.supplierDetails = null;
      state.availableDeliveries = [];
      state.activeDeliveries = [];
      state.deliveryHistory = [];
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register supplier details
      .addCase(registerSupplierDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerSupplierDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.supplierDetails = action.payload;
        state.message = "Supplier details registered successfully";
      })
      .addCase(registerSupplierDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update supplier details
      .addCase(updateSupplierDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupplierDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.supplierDetails = action.payload;
        state.message = "Supplier details updated successfully";
      })
      .addCase(updateSupplierDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update current location
      .addCase(updateCurrentLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCurrentLocation.fulfilled, (state, action) => {
        state.loading = false;
        if (state.supplierDetails) {
          state.supplierDetails.currentLocation = action.payload;
        }
        state.message = "Location updated successfully";
      })
      .addCase(updateCurrentLocation.rejected, (state, action) => {
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
        state.availableDeliveries = state.availableDeliveries.filter(
          (delivery) => delivery.id !== action.payload.orderItemId
        );
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

        // Update the delivery in activeDeliveries
        const updatedDelivery = action.payload;

        // If delivery is completed (Delivered, Failed, Cancelled), move it to history
        if (
          ["Delivered", "Failed", "Cancelled"].includes(updatedDelivery.status)
        ) {
          state.activeDeliveries = state.activeDeliveries.filter(
            (delivery) => delivery.id !== updatedDelivery.id
          );

          // Add to history if not already there
          const existsInHistory = state.deliveryHistory.some(
            (delivery) => delivery.id === updatedDelivery.id
          );

          if (!existsInHistory) {
            state.deliveryHistory = [updatedDelivery, ...state.deliveryHistory];
          }
        } else {
          // Just update the status in active deliveries
          state.activeDeliveries = state.activeDeliveries.map((delivery) =>
            delivery.id === updatedDelivery.id ? updatedDelivery : delivery
          );
        }

        state.message = "Delivery status updated successfully";
      })
      .addCase(updateDeliveryStatus.rejected, (state, action) => {
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
        state.deliveryHistory = action.payload.data;
      })
      .addCase(getDeliveryHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get supplier details
      .addCase(getSupplierDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSupplierDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.supplierDetails = action.payload;
      })
      .addCase(getSupplierDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSupplierState } = supplierSlice.actions;

export default supplierSlice.reducer;
