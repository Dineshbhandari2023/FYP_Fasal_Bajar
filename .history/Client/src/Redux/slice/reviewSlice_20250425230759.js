import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000";

// Async thunks for reviews
export const fetchFarmerReviews = createAsyncThunk(
  "reviews/fetchFarmerReviews",
  async (farmerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${SERVER_URL}/reviews/farmer/${farmerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Fetched farmer reviews:", response.data); // Debug log
      return response.data.Result.reviews; // Ensure correct data path
    } catch (error) {
      console.error("Error fetching farmer reviews:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.ErrorMessage || "Failed to fetch reviews"
      );
    }
  }
);

export const fetchSupplierReviews = createAsyncThunk(
  "reviews/fetchSupplierReviews",
  async (supplierId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/reviews/supplier/${supplierId}`
      );
      return response.data.Result.reviews;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage || "Failed to fetch reviews"
      );
    }
  }
);

export const fetchFarmerRating = createAsyncThunk(
  "reviews/fetchFarmerRating",
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/reviews/farmer/${farmerId}/rating`
      );
      return response.data.Result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage || "Failed to fetch rating"
      );
    }
  }
);

export const fetchSupplierRating = createAsyncThunk(
  "reviews/fetchSupplierRating",
  async (supplierId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/reviews/supplier/${supplierId}/rating`
      );
      return response.data.Result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage || "Failed to fetch rating"
      );
    }
  }
);

export const submitReview = createAsyncThunk(
  "reviews/submitReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      console.log("Sending review data:", reviewData);

      const response = await axios.post(`${API_URL}/reviews`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.Result.review;
    } catch (error) {
      console.error("Review submission error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.ErrorMessage || "Failed to submit review"
      );
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.put(
        `${API_URL}/reviews/${reviewId}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.Result.review;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage || "Failed to update review"
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return reviewId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.ErrorMessage || "Failed to delete review"
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [], // Stores reviews for the current entity (farmer or supplier)
    rating: {
      averageRating: 0,
      totalReviews: 0,
    },
    loading: false,
    error: null,
    submitLoading: false,
    submitError: null,
    submitSuccess: false,
  },
  reducers: {
    resetSubmitStatus: (state) => {
      state.submitLoading = false;
      state.submitError = null;
      state.submitSuccess = false;
    },
    addSocketReview: (state, action) => {
      state.reviews = [action.payload, ...state.reviews];
      const totalRating =
        state.rating.averageRating * state.rating.totalReviews +
        action.payload.rating;
      state.rating.totalReviews += 1;
      state.rating.averageRating = totalRating / state.rating.totalReviews;
    },
    updateSocketReview: (state, action) => {
      const index = state.reviews.findIndex(
        (review) => review.id === action.payload.id
      );
      if (index !== -1) {
        const oldRating = state.reviews[index].rating;
        const newRating = action.payload.rating;
        const totalRating =
          state.rating.averageRating * state.rating.totalReviews -
          oldRating +
          newRating;
        state.rating.averageRating = totalRating / state.rating.totalReviews;
        state.reviews[index] = action.payload;
      }
    },
    deleteSocketReview: (state, action) => {
      const index = state.reviews.findIndex(
        (review) => review.id === action.payload
      );
      if (index !== -1) {
        const oldRating = state.reviews[index].rating;
        const totalRating =
          state.rating.averageRating * state.rating.totalReviews - oldRating;
        state.rating.totalReviews -= 1;
        state.rating.averageRating =
          state.rating.totalReviews > 0
            ? totalRating / state.rating.totalReviews
            : 0;
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch farmer reviews
      .addCase(fetchFarmerReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmerReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload; // Update reviews array
      })
      .addCase(fetchFarmerReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      // Fetch supplier reviews
      .addCase(fetchSupplierReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchSupplierReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch farmer rating
      .addCase(fetchFarmerRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmerRating.fulfilled, (state, action) => {
        state.loading = false;
        state.rating = action.payload;
      })
      .addCase(fetchFarmerRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch supplier rating
      .addCase(fetchSupplierRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierRating.fulfilled, (state, action) => {
        state.loading = false;
        state.rating = action.payload;
      })
      .addCase(fetchSupplierRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit review
      .addCase(submitReview.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.submitSuccess = true;
        state.reviews = [action.payload, ...state.reviews];
        const totalRating =
          state.rating.averageRating * state.rating.totalReviews +
          action.payload.rating;
        state.rating.totalReviews += 1;
        state.rating.averageRating = totalRating / state.rating.totalReviews;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload;
      })

      // Update review
      .addCase(updateReview.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.submitSuccess = true;
        const index = state.reviews.findIndex(
          (review) => review.id === action.payload.id
        );
        if (index !== -1) {
          const oldRating = state.reviews[index].rating;
          const newRating = action.payload.rating;
          const totalRating =
            state.rating.averageRating * state.rating.totalReviews -
            oldRating +
            newRating;
          state.rating.averageRating = totalRating / state.rating.totalReviews;
          state.reviews[index] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload;
      })

      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.submitSuccess = true;
        const index = state.reviews.findIndex(
          (review) => review.id === action.payload
        );
        if (index !== -1) {
          const oldRating = state.reviews[index].rating;
          const totalRating =
            state.rating.averageRating * state.rating.totalReviews - oldRating;
          state.rating.totalReviews -= 1;
          state.rating.averageRating =
            state.rating.totalReviews > 0
              ? totalRating / state.rating.totalReviews
              : 0;
          state.reviews = state.reviews.filter(
            (review) => review.id !== action.payload
          );
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload;
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
