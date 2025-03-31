const PaymentTransaction = require("../Models/paymentTransaction");
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

// import { Transaction } from "./model/Transaction.model.js";
// import { EsewaPaymentGateway, EsewaCheckStatus } from "esewajs";

// Initiates the payment using transactionId from the frontend
const EsewaInitiatePayment = async (req, res) => {
  // Expecting transactionId instead of productId
  const { amount, transactionId } = req.body;
  try {
    const { EsewaPaymentGateway } = await import("esewajs");
    const reqPayment = await EsewaPaymentGateway(
      amount,
      0,
      0,
      0,
      transactionId,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL,
      undefined,
      undefined
    );
    if (!reqPayment) {
      return res.status(400).json("Error sending data");
    }
    if (reqPayment.status === 200) {
      // Create and save a new transaction using transactionId
      const transaction = new Transaction({
        transactionId: transactionId,
        amount: amount,
      });
      await transaction.save();
      console.log("Transaction initiated successfully");
      return res.send({
        url: reqPayment.request.res.responseUrl,
      });
    }
  } catch (error) {
    console.error("Error in initiating payment:", error);
    return res.status(400).json("Error sending data");
  }
};

// Checks the payment status and updates the transaction record based on transactionId
const paymentStatus = async (req, res) => {
  // Extract transactionId from the request body
  const { transactionId } = req.body;
  try {
    // Find the transaction by its transactionId
    const transaction = await Transaction.findOne({ transactionId });
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }
    const paymentStatusCheck = await EsewaCheckStatus(
      transaction.amount,
      transaction.transactionId,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );
    if (paymentStatusCheck.status === 200) {
      // Update the transaction status
      transaction.status = paymentStatusCheck.data.status;
      await transaction.save();
      return res
        .status(200)
        .json({ message: "Transaction status updated successfully" });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = { EsewaInitiatePayment, paymentStatus };
