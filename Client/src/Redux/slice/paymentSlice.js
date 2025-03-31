import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  paymentUrl: null, // URL to redirect for payment if needed
  paymentStatus: null, // e.g., "Completed", "Pending", "Failed"
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    initiatePaymentRequest(state) {
      state.loading = true;
      state.error = null;
      state.paymentUrl = null;
    },
    initiatePaymentSuccess(state, action) {
      state.loading = false;
      state.paymentUrl = action.payload;
    },
    initiatePaymentFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    checkPaymentStatusRequest(state) {
      state.loading = true;
      state.error = null;
    },
    checkPaymentStatusSuccess(state, action) {
      state.loading = false;
      state.paymentStatus = action.payload;
    },
    checkPaymentStatusFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetPaymentState(state) {
      state.loading = false;
      state.paymentUrl = null;
      state.paymentStatus = null;
      state.error = null;
    },
  },
});

export const {
  initiatePaymentRequest,
  initiatePaymentSuccess,
  initiatePaymentFailure,
  checkPaymentStatusRequest,
  checkPaymentStatusSuccess,
  checkPaymentStatusFailure,
  resetPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;
