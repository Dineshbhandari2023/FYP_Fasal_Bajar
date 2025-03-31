const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  paymentSuccess,
} = require("./controllers/esewaController");

router.post("/initiate-payment", initiatePayment);
router.get("/esewa-success", paymentSuccess);
router.get("/esewa-failure", (req, res) =>
  res.redirect("http://localhost:5173/payment-failure")
);

module.exports = router;
