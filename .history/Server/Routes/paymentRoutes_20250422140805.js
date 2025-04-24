const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/paymentController");
const { authMiddleWare } = require("../Util/jwt");

// router.post("/initiate-payment", paymentController.initiatePayment);
router.post("/status", authMiddleware, checkPaymentStatus);

module.exports = router;
