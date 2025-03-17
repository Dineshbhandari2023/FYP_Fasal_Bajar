// slices/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching all products
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/products");
      return response.data.Result.productData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Async thunk for creating a product (with image upload)
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (formData, thunkAPI) => {
    try {
      // formData should be a FormData instance containing product fields and the image file
      const response = await axios.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.Result.productData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create product";
      });
  },
});

export default productSlice.reducer;
