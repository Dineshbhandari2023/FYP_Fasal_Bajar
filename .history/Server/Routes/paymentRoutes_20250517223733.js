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
// const express = require("express");
// const router = express.Router();
// const paymentController = require("../Controllers/paymentController");
// const { authMiddleWare } = require("../Util/jwt");

// // Initiate payment for an order
// router.post(
//   "/orders/:orderId/payment",
//   authMiddleWare,
//   paymentController.initiatePayment
// );

// // Check payment status
// router.post(
//   "/payment/check-status",
//   authMiddleWare,
//   paymentController.checkPaymentStatus
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  checkPaymentStatus,
} = require("../Controllers/paymentController");
// const { protect } = require("../Middleware/authMiddleware");
const { authMiddleWare } = require("../Util/jwt");

router.post("/initiate-payment/:orderId", authMiddleWare, initiatePayment);
router.post("/check-status", authMiddleWare, checkPaymentStatus);

module.exports = router;
