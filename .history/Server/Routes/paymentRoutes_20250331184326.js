const express = require("express");
const router = express.Router();
const {
  initiateEsewaPayment,
  verifyEsewaPayment,
} = require("../Controllers/paymentController");

router.post("/initiate-payment", initiateEsewaPayment);
router.get("/esewa-payment-success", verifyEsewaPayment);

module.exports = router;
