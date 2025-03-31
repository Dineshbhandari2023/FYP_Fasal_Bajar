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

// const PaymentTransaction = require("../Models/paymentTransaction");
// const dotenv = require("dotenv");
// dotenv.config();

// const axios = require("axios");

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

const axios = require("axios");
const crypto = require("crypto");
const PaymentTransaction = require("../Models/paymentTransaction");

const generateSignature = (
  total_amount,
  transaction_uuid = productId ||
    `txn_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
  product_code,
  secretKey
) => {
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  return crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");
};

const initiatePayment = async (req, res) => {
  const { amount, productId } = req.body;

  if (!amount || isNaN(amount) || !productId) {
    console.error("Invalid data provided:", req.body);
    return res
      .status(400)
      .json({ error: "Invalid payment amount or missing product ID." });
  }

  const totalAmount = Number(amount);
  const transaction_uuid = productId;
  const product_code = process.env.PRODUCT_CODE;
  const secretKey = process.env.SECRET;

  const signature = generateSignature(
    totalAmount,
    transaction_uuid,
    product_code,
    secretKey
  );

  const formData = {
    amount: totalAmount,
    tax_amount: 0,
    product_service_charge: 0,
    product_delivery_charge: 0,
    total_amount: totalAmount,
    transaction_uuid,
    product_code,
    success_url: process.env.SUCCESS_URL,
    failure_url: process.env.FAILURE_URL,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
  };

  try {
    const paymentResponse = await axios.post(
      process.env.ESEWAPAYMENT_URL,
      formData
    );

    if (paymentResponse.status === 200 && paymentResponse.data) {
      await PaymentTransaction.create({
        productId,
        amount: totalAmount,
        paymentMethod: "Online Payment",
        status: "Pending",
      });

      return res.status(200).json({ url: paymentResponse.data.payment_url });
    } else {
      console.error("Esewa gateway response error:", paymentResponse.data);
      return res
        .status(400)
        .json({ error: "Payment initiation failed at gateway." });
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// const checkPaymentStatus = async (req, res) => {
//   const { productId } = req.body;

//   if (!productId) {
//     return res.status(400).json({ error: "Product ID is required." });
//   }

//   try {
//     const transaction = await PaymentTransaction.findOne({
//       where: { productId },
//     });

//     if (!transaction) {
//       return res.status(404).json({ error: "Transaction not found." });
//     }

//     const statusCheckURL = `${process.env.ESEWAPAYMENT_STATUS_CHECK_URL}?product_code=${process.env.PRODUCT_CODE}&total_amount=${transaction.amount}&transaction_uuid=${productId}`;

//     const paymentStatusResponse = await axios.get(statusCheckURL);

//     if (paymentStatusResponse.status === 200) {
//       transaction.status =
//         paymentStatusResponse.data.status === "COMPLETE"
//           ? "Completed"
//           : "Failed";
//       await transaction.save();

//       return res.status(200).json({
//         message: "Transaction status updated successfully.",
//         status: transaction.status,
//       });
//     } else {
//       return res
//         .status(400)
//         .json({ error: "Failed to fetch transaction status from Esewa." });
//     }
//   } catch (error) {
//     console.error("Payment status check error:", error);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// };

const checkPaymentStatus = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required." });
  }

  try {
    const transaction = await PaymentTransaction.findOne({
      where: { productId },
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    const { EsewaCheckStatus } = await import("esewajs");
    const paymentStatusResponse = await EsewaCheckStatus(
      transaction.amount,
      transaction.productId,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (
      paymentStatusResponse.status === 200 &&
      paymentStatusResponse.data.status === "COMPLETE"
    ) {
      transaction.status = "Completed";
      await transaction.save();

      // Automatically create an order after payment verification
      const order = await Order.create({
        orderNumber: `ORD-${Date.now()}`,
        totalAmount: transaction.amount,
        paymentMethod: "Online Payment",
        paymentStatus: "Completed",
        shippingAddress: "From frontend (should pass explicitly if available)",
        buyerId: req.user.id, // assuming user info from auth middleware
      });

      return res.status(200).json({
        message: "Payment successful and order created.",
        status: transaction.status,
        orderNumber: order.orderNumber,
      });
    } else {
      transaction.status = "Failed";
      await transaction.save();
      return res.status(400).json({ error: "Payment not completed." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { initiatePayment, checkPaymentStatus };
