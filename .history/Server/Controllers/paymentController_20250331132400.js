// const PaymentTransaction = require("../Models/paymentTransaction");
// const { randomUUID } = require("crypto");

// // Initiate Esewa Payment
// const EsewaInitiatePayment = async (req, res) => {
//   const { amount, productId, paymentMethod, orderId } = req.body;
//   // Use productId if provided, otherwise generate a new UUID for transactionId
//   const transactionId = productId || randomUUID();

//   try {
//     // Dynamically import EsewaPaymentGateway from esewajs
//     const { EsewaPaymentGateway } = await import("esewajs");
//     const reqPayment = await EsewaPaymentGateway(
//       amount, // total amount
//       0, // product_delivery_charge
//       0, // product_service_charge
//       0, // tax_amount
//       transactionId, // transaction_uuid (must be defined)
//       process.env.MERCHANT_ID,
//       process.env.SECRET,
//       process.env.SUCCESS_URL,
//       process.env.FAILURE_URL,
//       process.env.ESEWAPAYMENT_URL,
//       undefined,
//       undefined
//     );

//     if (!reqPayment) {
//       return res.status(400).json({ message: "Error sending payment request" });
//     }

//     if (reqPayment.status === 200) {
//       // Save transaction in the database (orderId can be null)
//       const transaction = await PaymentTransaction.create({
//         transactionId,
//         amount,
//         orderId, // may be null if not provided
//         paymentMethod,
//         status: "Pending",
//       });

//       console.log("Transaction saved successfully");
//       return res.json({
//         paymentUrl: reqPayment.request.res.responseUrl,
//         transaction,
//       });
//     } else {
//       return res
//         .status(400)
//         .json({ message: "Payment request failed", data: reqPayment });
//     }
//   } catch (error) {
//     console.error("Error initiating Esewa payment:", error);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// // Check Payment Status
// const paymentStatus = async (req, res) => {
//   const { transactionId } = req.body;

//   try {
//     // Find the transaction in the database
//     const transaction = await PaymentTransaction.findOne({
//       where: { transactionId },
//     });

//     if (!transaction) {
//       return res.status(404).json({ message: "Transaction not found" });
//     }

//     // Dynamically import EsewaCheckStatus from esewajs
//     const { EsewaCheckStatus } = await import("esewajs");
//     const paymentStatusCheck = await EsewaCheckStatus(
//       transaction.amount,
//       transaction.transactionId,
//       process.env.MERCHANT_ID,
//       process.env.ESEWAPAYMENT_STATUS_CHECK_URL
//     );

//     if (paymentStatusCheck.status === 200) {
//       // Update transaction status in the database
//       transaction.status = paymentStatusCheck.data.status;
//       await transaction.save();

//       return res.json({
//         message: "Transaction status updated",
//         status: transaction.status,
//       });
//     } else {
//       return res
//         .status(400)
//         .json({ message: "Failed to retrieve payment status" });
//     }
//   } catch (error) {
//     console.error("Error updating transaction status:", error);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// module.exports = { EsewaInitiatePayment, paymentStatus };

// paymentController.js

const PaymentTransaction = require("../Models/paymentTransaction");
const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");

// const initiatePayment = async (req, res) => {
//   const { amount } = req.body;

//   if (!amount || isNaN(amount)) {
//     return res.status(400).json({ error: "Invalid payment amount." });
//   }

//   const transactionId = `txn_${Date.now()}_${Math.random()
//     .toString(36)
//     .substr(2, 9)}`;

//   try {
//     const { EsewaPaymentGateway } = await import("esewajs");

//     const paymentResponse = await EsewaPaymentGateway(
//       amount,
//       0,
//       0,
//       0,
//       transactionId,
//       process.env.MERCHANT_ID,
//       process.env.SECRET,
//       process.env.SUCCESS_URL,
//       process.env.FAILURE_URL,
//       process.env.ESEWAPAYMENT_URL
//     );

//     if (paymentResponse.status === 200) {
//       await PaymentTransaction.create({
//         transactionId,
//         amount,
//         paymentMethod: "Online Payment",
//       });

//       return res
//         .status(200)
//         .json({ url: paymentResponse.request.res.responseUrl });
//     } else {
//       return res.status(400).json({ error: "Payment initiation failed." });
//     }
//   } catch (error) {
//     console.error("Payment initiation error:", error);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// };

const initiatePayment = async (req, res) => {
  const { amount, transactionId } = req.body;

  if (!amount || isNaN(amount) || !transactionId) {
    console.error("Invalid data provided:", req.body);
    return res
      .status(400)
      .json({ error: "Invalid payment amount or missing transaction ID." });
  }

  try {
    const { EsewaPaymentGateway } = await import("esewajs");

    const paymentResponse = await EsewaPaymentGateway(
      amount,
      0,
      0,
      0,
      transactionId,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL
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
      console.error("Esewa gateway response error:", paymentResponse);
      return res
        .status(400)
        .json({ error: "Payment initiation failed at gateway." });
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
    const { EsewaCheckStatus } = await import("esewajs");

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
