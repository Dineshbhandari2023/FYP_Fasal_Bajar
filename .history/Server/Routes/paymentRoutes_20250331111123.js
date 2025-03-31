const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/paymentController");

router.post("/initiate-payment", paymentController.EsewaInitiatePayment);
router.post("/payment-status", paymentController.paymentStatus);

module.exports = router;
