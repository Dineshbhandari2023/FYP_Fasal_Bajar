// paymentController.js

const { EsewaPaymentGateway, EsewaCheckStatus } = require("esewajs");
const PaymentTransaction = require("../models/paymentTransaction");
const dotenv = require("dotenv");
dotenv.config();

const initiatePayment = async (req, res) => {
  const { amount } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: "Invalid payment amount." });
  }

  const transactionId = `txn_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  try {
    const paymentResponse = await EsewaPaymentGateway(
      amount,
      0, // productDeliveryCharge
      0, // productServiceCharge
      0, // taxAmount
      transactionId,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL,
      undefined,
      undefined
    );

    if (paymentResponse.status === 200) {
      await PaymentTransaction.create({
        transactionId,
        amount,
        paymentMethod: "Online Payment",
      });

      return res
        .status(200)
        .json({ url: paymentResponse.request.res.responseUrl });
    } else {
      return res.status(400).json({ error: "Payment initiation failed." });
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const checkPaymentStatus = async (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ error: "Transaction ID is required." });
  }

  try {
    const transaction = await PaymentTransaction.findOne({
      where: { transactionId },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    const paymentStatusResponse = await EsewaCheckStatus(
      transaction.amount,
      transaction.transactionId,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (paymentStatusResponse.status === 200) {
      transaction.status =
        paymentStatusResponse.data.status === "COMPLETE"
          ? "Completed"
          : "Failed";
      await transaction.save();

      return res.status(200).json({
        message: "Transaction status updated successfully.",
        status: transaction.status,
      });
    } else {
      return res
        .status(400)
        .json({ error: "Failed to fetch transaction status from Esewa." });
    }
  } catch (error) {
    console.error("Payment status check error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { initiatePayment, checkPaymentStatus };
