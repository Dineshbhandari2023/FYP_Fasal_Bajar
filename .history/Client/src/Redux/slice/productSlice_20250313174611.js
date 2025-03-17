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
      });
  },
});

export default productsSlice.reducer;
