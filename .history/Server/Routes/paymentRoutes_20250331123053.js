const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/paymentController");

router.post("/initiate-payment", paymentController.initiatePayment);
router.post("/payment-status", paymentController.checkPaymentStatus);

module.exports = router;
