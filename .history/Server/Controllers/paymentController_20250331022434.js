// controllers/paymentController.js
const axios = require("axios");
const crypto = require("crypto");
const PaymentTransaction = require("../Models/paymentTransaction");
require("dotenv").config();

// Utility function to generate HMAC SHA256 signature
const generateHmacSha256Hash = (data, secret) => {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
};

// Initiate Payment: Create a new payment transaction and call the eSewa payment API
exports.initiatePayment = async (req, res) => {
  const { orderId, amount } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({ error: "orderId and amount are required" });
  }

  // For simplicity, we use orderId as the transaction UUID.
  const transactionUuid = orderId;

  // Prepare the payment data required by eSewa
  let paymentData = {
    total_amount: amount,
    transaction_uuid: transactionUuid,
    product_code: process.env.MERCHANT_ID,
    success_url: process.env.SUCCESS_URL,
    failure_url: process.env.FAILURE_URL,
    tax_amount: "0",
    product_delivery_charge: "0",
    product_service_charge: "0",
    signed_field_names: "total_amount,transaction_uuid,product_code",
  };

  // Generate a signature using the data string and your secret key
  const dataString = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
  paymentData.signature = generateHmacSha256Hash(
    dataString,
    process.env.SECRET
  );

  try {
    // Call the eSewa payment gateway (assuming a POST request)
    const paymentResponse = await axios.post(
      process.env.ESEWAPAYMENT_URL,
      null,
      {
        params: paymentData,
      }
    );
    console.log("ESEWAPAYMENT_URL:", process.env.ESEWAPAYMENT_URL);

    if (paymentResponse.status === 200) {
      // Create a new PaymentTransaction record with status 'Pending'
      await PaymentTransaction.create({
        transactionId: transactionUuid,
        amount: amount,
        status: "Pending",
        paymentMethod: "Online Payment",
        orderId: orderId,
      });

      // Extract the redirect URL from the response.
      // Depending on the eSewa API response structure, adjust as needed.
      const redirectUrl =
        paymentResponse.data?.responseUrl ||
        paymentResponse.request?.res?.responseUrl;

      return res.status(200).json({ url: redirectUrl });
    } else {
      return res.status(paymentResponse.status).json({
        error: "Error initiating payment at eSewa",
      });
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

// Verify Payment: Check the payment status from eSewa and update the transaction
exports.paymentStatus = async (req, res) => {
  const { transactionId } = req.body;
  if (!transactionId) {
    return res.status(400).json({ error: "transactionId is required" });
  }

  try {
    // Find the corresponding payment transaction in your database
    const paymentTransaction = await PaymentTransaction.findOne({
      where: { transactionId },
    });
    if (!paymentTransaction) {
      return res.status(404).json({ error: "Payment transaction not found" });
    }

    // Prepare data for status check
    const statusData = {
      product_code: process.env.MERCHANT_ID,
      total_amount: paymentTransaction.amount,
      transaction_uuid: transactionId,
    };

    // Call the eSewa status check API (using a GET request)
    const statusResponse = await axios.get(
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL,
      { params: statusData }
    );

    if (statusResponse.status === 200 && statusResponse.data) {
      // Assume the response data has a "status" field (e.g., "Completed" or "Failed")
      const updatedStatus = statusResponse.data.status;
      paymentTransaction.status = updatedStatus;
      await paymentTransaction.save();

      return res.status(200).json({
        message: "Transaction status updated successfully",
        status: updatedStatus,
      });
    } else {
      return res
        .status(400)
        .json({ error: "Failed to verify payment status from eSewa" });
    }
  } catch (error) {
    console.error("Error verifying payment status:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
