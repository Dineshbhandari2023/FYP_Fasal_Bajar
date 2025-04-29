// const express = require("express");
// const router = express.Router();
// const paymentController = require("../Controllers/paymentController");
// const { authMiddleWare } = require("../Util/jwt");

// // router.post("/initiate-payment", paymentController.initiatePayment);
// router.post(
//   "/check-status",
//   authMiddleWare,
//   paymentController.checkPaymentStatus
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware"); // Adjust path to your auth middleware

// Initiate payment for an order
router.post(
  "/orders/:orderId/payment",
  authMiddleware,
  paymentController.initiatePayment
);

// Check payment status
router.post(
  "/payment/check-status",
  authMiddleware,
  paymentController.checkPaymentStatus
);

module.exports = router;
