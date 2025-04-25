import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000";

// Fetch reviews & rating for Farmer
export const fetchFarmerReviews = createAsyncThunk(
  "reviews/fetchFarmerReviews",
  async (farmerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API_URL}/reviews/farmer/${farmerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.Result.reviews;
    } catch (err) {
      return rejectWithValue(err.response?.data?.ErrorMessage || err.message);
    }
  }
);

export const fetchFarmerRating = createAsyncThunk(
  "reviews/fetchFarmerRating",
  async (farmerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(
        `${API_URL}/reviews/farmer/${farmerId}/rating`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.Result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.ErrorMessage || err.message);
    }
  }
);

// Fetch reviews & rating for Supplier
export const fetchSupplierReviews = createAsyncThunk(
  "reviews/fetchSupplierReviews",
  async (supplierId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API_URL}/reviews/supplier/${supplierId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      return res.data.Result.reviews;
    } catch (err) {
      return rejectWithValue(err.response?.data?.ErrorMessage || err.message);
    }
  }
);

export const fetchSupplierRating = createAsyncThunk(
  "reviews/fetchSupplierRating",
  async (supplierId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(
        `${API_URL}/reviews/supplier/${supplierId}/rating`,
        { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
      );
      return res.data.Result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.ErrorMessage || err.message);
    }
  }
);

// Create / update / delete
export const submitReview = createAsyncThunk(
  "reviews/submitReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(`${API_URL}/reviews`, reviewData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.Result.review;
    } catch (err) {
      return rejectWithValue(err.response?.data?.ErrorMessage || err.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.put(
        `${API_URL}/reviews/${reviewId}`,
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.Result.review;
    } catch (err) {
      return rejectWithValue(err.response?.data?.ErrorMessage || err.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return reviewId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.ErrorMessage || err.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    rating: { averageRating: 0, totalReviews: 0 },
    loading: false,
    error: null,
    submitLoading: false,
    submitError: null,
    submitSuccess: false,
  },
  reducers: {
    resetSubmitStatus: (s) => {
      s.submitLoading = false;
      s.submitError = null;
      s.submitSuccess = false;
    },
    addSocketReview: (s, a) => {
      s.reviews.unshift(a.payload);
      const total =
        s.rating.averageRating * s.rating.totalReviews + a.payload.rating;
      s.rating.totalReviews++;
      s.rating.averageRating = total / s.rating.totalReviews;
    },
    updateSocketReview: (s, a) => {
      const idx = s.reviews.findIndex((r) => r.id === a.payload.id);
      if (idx !== -1) {
        const old = s.reviews[idx].rating;
        const nw = a.payload.rating;
        const total = s.rating.averageRating * s.rating.totalReviews - old + nw;
        s.rating.averageRating = total / s.rating.totalReviews;
        s.reviews[idx] = a.payload;
      }
    },
    deleteSocketReview: (s, a) => {
      const idx = s.reviews.findIndex((r) => r.id === a.payload);
      if (idx !== -1) {
        const old = s.reviews[idx].rating;
        const total = s.rating.averageRating * s.rating.totalReviews - old;
        s.rating.totalReviews--;
        s.rating.averageRating = s.rating.totalReviews
          ? total / s.rating.totalReviews
          : 0;
        s.reviews.splice(idx, 1);
      }
    },
  },
  extraReducers: (b) => {
    // Farmer
    b.addCase(fetchFarmerReviews.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchFarmerReviews.fulfilled, (s, a) => {
      s.loading = false;
      s.reviews = a.payload;
    });
    b.addCase(fetchFarmerReviews.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });
    b.addCase(fetchFarmerRating.fulfilled, (s, a) => {
      s.rating = a.payload;
    });
    // Supplier
    b.addCase(fetchSupplierReviews.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchSupplierReviews.fulfilled, (s, a) => {
      s.loading = false;
      s.reviews = a.payload;
    });
    b.addCase(fetchSupplierReviews.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });
    b.addCase(fetchSupplierRating.fulfilled, (s, a) => {
      s.rating = a.payload;
    });
    // Submit / Update / Delete
    b.addCase(submitReview.pending, (s) => {
      s.submitLoading = true;
      s.submitError = null;
    });
    b.addCase(submitReview.fulfilled, (s, a) => {
      s.submitLoading = false;
      s.submitSuccess = true;
      s.reviews.unshift(a.payload);
      const tot =
        s.rating.averageRating * s.rating.totalReviews + a.payload.rating;
      s.rating.totalReviews++;
      s.rating.averageRating = tot / s.rating.totalReviews;
    });
    b.addCase(submitReview.rejected, (s, a) => {
      s.submitLoading = false;
      s.submitError = a.payload;
    });
    b.addCase(updateReview.fulfilled, (s, a) => {
      const idx = s.reviews.findIndex((r) => r.id === a.payload.id);
      if (idx !== -1) {
        const old = s.reviews[idx].rating;
        const nw = a.payload.rating;
        const tot = s.rating.averageRating * s.rating.totalReviews - old + nw;
        s.rating.averageRating = tot / s.rating.totalReviews;
        s.reviews[idx] = a.payload;
      }
      s.submitLoading = false;
      s.submitSuccess = true;
    });
    b.addCase(deleteReview.fulfilled, (s, a) => {
      const idx = s.reviews.findIndex((r) => r.id === a.payload);
      if (idx !== -1) {
        const old = s.reviews[idx].rating;
        const tot = s.rating.averageRating * s.rating.totalReviews - old;
        s.rating.totalReviews--;
        s.rating.averageRating = s.rating.totalReviews
          ? tot / s.rating.totalReviews
          : 0;
        s.reviews.splice(idx, 1);
      }
      s.submitLoading = false;
      s.submitSuccess = true;
    });
  },
});

export const {
  resetSubmitStatus,
  addSocketReview,
  updateSocketReview,
  deleteSocketReview,
} = reviewSlice.actions;
export default reviewSlice.reducer;
