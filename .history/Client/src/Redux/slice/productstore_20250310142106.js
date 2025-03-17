import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import ApiLink from "../path/to/ApiLink";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { url, method } = ApiLink.getAllProducts;
      const response = await axios({ url, method });
      return response.data; // Make sure your backend returns a product array
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { url, method } = ApiLink.createProduct;
      const response = await axios({
        url,
        method,
        data: productData,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { url, method } = ApiLink.updateProduct;
      const response = await axios({
        url: url(id), // pass the ID into the url function
        method,
        data: updatedData, // your updated product data
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { url, method } = ApiLink.deleteProduct;
      await axios({ url: url(id), method });
      return id; // Return the deleted product's ID
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productStore = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ─────────────────────────────────────────────────────────────────────────────
      // Fetch Products
      // ─────────────────────────────────────────────────────────────────────────────
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // product array
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ─────────────────────────────────────────────────────────────────────────────
      // Create Product
      // ─────────────────────────────────────────────────────────────────────────────
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
        state.error = action.payload || action.error.message;
      })

      // ─────────────────────────────────────────────────────────────────────────────
      // Update Product
      // ─────────────────────────────────────────────────────────────────────────────
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (p) => p.id === updatedProduct.id
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ─────────────────────────────────────────────────────────────────────────────
      // Delete Product
      // ─────────────────────────────────────────────────────────────────────────────
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default productStore.reducer;
