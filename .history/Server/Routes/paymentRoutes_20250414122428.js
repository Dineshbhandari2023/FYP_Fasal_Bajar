const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/paymentController");
const { authMiddleWare } = require("../Util/jwt");

// Protect payment routes with authentication
router.post(
  "/initiate-payment",
  authMiddleWare,
  paymentController.initiatePayment
);
router.post(
  "/payment-status",
  authMiddleWare,
  paymentController.checkPaymentStatus
);

module.exports = router;
