import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import ApiLink from "../../Routes/api";

// Public route: Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      // Using the ApiLink for getAllProducts
      const { url, method } = ApiLink.getAllProducts;
      const response = await axios({ url, method });
      // Assuming your backend returns:
      // { StatusCode: 200, IsSuccess: true, ErrorMessage: [], Result: { productData: [...] } }
      return response.data.Result.productData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Protected route: Create a new product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { url, method } = ApiLink.createProduct;
      // Get the auth token from localStorage/sessionStorage
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios({
        url,
        method,
        data: productData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      return response.data.Result.productData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Protected route: Update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { url, method } = ApiLink.updateProduct;
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios({
        url: url(id), // e.g., /products/{id}
        method,
        data: updatedData,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      return response.data.Result.productData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Protected route: Delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { url, method } = ApiLink.deleteProduct;
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios({
        url: url(id), // e.g., /products/{id}
        method,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      return id;
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
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // payload is the product array
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Create Product
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
      // Update Product
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
      // Delete Product
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
