import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./axiosInstance";

// Set up Axios with default configuration
// axios.defaults.baseURL = "http://localhost:8000";
// axios.defaults.withCredentials = true;

const initialState = {
  products: [],
  loading: false,
  error: null,
};

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/products");
      return response.data.Result.productData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Create a new product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const { data } = await axios.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return data.Result.productData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Fetch products for the logged-in user
export const fetchMyProducts = createAsyncThunk(
  "products/fetchMyProducts",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      // Call the new endpoint /products/myproducts
      const response = await axios.get("/products/myproducts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return response.data.Result.productData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      await axios.delete(`/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      // Return the productId so we can remove it from state
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, formData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.accessToken;
      const response = await axios.put(`/products/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      // Return the updated product
      return response.data.Result.productData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.ErrorMessage || error.message
      );
    }
  }
);

// Products slice
const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Optionally add synchronous reducers here
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
        state.error = action.payload;
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
        state.error = action.payload;
      })
      // ========== fetchMyProducts ==========
      .addCase(fetchMyProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // set products to the user's products
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== deleteProduct ==========
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the product from state
        const productId = action.payload;
        state.products = state.products.filter((p) => p._id !== productId);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== updateProduct ==========
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        // Find and replace in the array
        state.products = state.products.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
