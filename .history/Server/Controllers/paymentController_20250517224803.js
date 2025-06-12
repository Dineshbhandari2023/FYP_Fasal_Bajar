// const { PaymentTransaction, Order } = require("../Models/index");
// const { sequelize } = require("../config/dbConfig");
// const { v4: uuidv4 } = require("uuid");
// const { Op } = require("sequelize");

// const requiredEnvVars = [
//   "MERCHANT_ID",
//   "SECRET",
//   "ESEWAPAYMENT_URL",
//   "ESEWAPAYMENT_STATUS_CHECK_URL",
//   "SUCCESS_URL",
//   "FAILURE_URL",
// ];

// const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
// if (missingVars.length > 0) {
//   throw new Error(
//     `Missing required environment variables: ${missingVars.join(", ")}`
//   );
// }

// const initiatePayment = async (
//   amount,
//   orderNumber,
//   buyerId,
//   paymentMethod,
//   transaction,
//   taxAmount = 0,
//   serviceCharge = 0,
//   deliveryCharge = 0
// ) => {
//   try {
//     const { EsewaPaymentGateway } = await import("esewajs");

//     // Check for existing PaymentTransaction records for this order
//     const existingTransaction = await PaymentTransaction.findOne({
//       where: {
//         buyerId,
//         status: "Pending",
//         orderNumber, // Match by orderNumber instead of productId
//       },
//       transaction,
//     });

//     let productId;
//     let paymentTransaction;

//     if (existingTransaction) {
//       // If there's an existing pending transaction, delete it to avoid duplicates
//       await existingTransaction.destroy({ transaction });
//     }

//     // Generate a completely random productId (transaction_uuid)
//     productId = uuidv4();

//     paymentTransaction = await PaymentTransaction.create(
//       {
//         productId,
//         orderNumber, // Store the orderNumber separately
//         amount,
//         status: "Pending",
//         paymentMethod,
//         buyerId,
//         paymentUrl: null,
//       },
//       { transaction }
//     );

//     const response = await EsewaPaymentGateway(
//       amount,
//       deliveryCharge,
//       serviceCharge,
//       taxAmount,
//       productId,
//       process.env.MERCHANT_ID,
//       process.env.SECRET,
//       process.env.SUCCESS_URL,
//       process.env.FAILURE_URL,
//       process.env.ESEWAPAYMENT_URL,
//       "sha256",
//       "base64"
//     );

//     const paymentData = response.config.params;

//     console.log("Extracted paymentData:", paymentData);

//     return { paymentTransaction, paymentData };
//   } catch (error) {
//     console.error("Payment initiation error:", error);
//     throw error;
//   }
// };

// const checkPaymentStatus = async (req, res) => {
//   const { productId } = req.body;
//   const buyerId = req.user.id;

//   if (!productId) {
//     return res.status(400).json({ error: "Product ID is required" });
//   }

//   let transaction;
//   try {
//     transaction = await sequelize.transaction();

//     const paymentTransaction = await PaymentTransaction.findOne(
//       {
//         where: { productId, buyerId },
//       },
//       { transaction }
//     );

//     if (!paymentTransaction) {
//       await transaction.rollback();
//       return res
//         .status(403)
//         .json({ error: "Unauthorized or transaction not found" });
//     }

//     const { EsewaCheckStatus } = await import("esewajs");

//     const paymentStatusResponse = await EsewaCheckStatus(
//       paymentTransaction.amount,
//       paymentTransaction.productId,
//       process.env.MERCHANT_ID,
//       process.env.ESEWAPAYMENT_STATUS_CHECK_URL
//     );

//     console.log("Payment status response:", paymentStatusResponse);

//     if (paymentStatusResponse.status === 200) {
//       const newStatus =
//         paymentStatusResponse.data.status === "COMPLETE"
//           ? "Completed"
//           : "Failed";
//       paymentTransaction.status = newStatus;
//       await paymentTransaction.save({ transaction });

//       if (newStatus === "Completed") {
//         const order = await Order.findOne(
//           { where: { orderNumber: paymentTransaction.orderNumber } }, // Use orderNumber
//           { transaction }
//         );

//         if (order) {
//           order.paymentStatus = "Completed";
//           order.status = "Confirmed";
//           await order.save({ transaction });
//         }
//       }

//       await transaction.commit();
//       return res.status(200).json({
//         message: "Transaction status updated successfully",
//         status: paymentTransaction.status,
//       });
//     } else {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ error: "Failed to fetch transaction status from Esewa" });
//     }
//   } catch (error) {
//     if (transaction) await transaction.rollback();
//     console.error("Payment status check error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = { initiatePayment, checkPaymentStatus };

// const { EsewaPaymentGateway, EsewaCheckStatus } = require("esewajs");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const sequelize = require("../config/dbConfig");
const PaymentTransaction = require("../Models/paymentTransaction");
const Order = require("../Models/order");
require("dotenv").config();

// Initialize eSewa configuration
const esewaConfig = {
  merchantId: process.env.ESEWA_MERCHANT_ID || "EPAYTEST",
  secretKey: process.env.ESEWA_SECRET_KEY || "your-secret-key",
  testMode: process.env.ESEWA_TEST_MODE === "true",
  verificationUrl: process.env.ESEWA_TEST_MODE
    ? "https://uat.esewa.com.np/epay/transrec"
    : "https://esewa.com.np/epay/transrec",
};

// Initiate eSewa payment
const initiatePayment = async (req, res) => {
  const { orderId } = req.params;
  const buyerId = req.user.id;

  let transaction;

  try {
    // Dynamically import esewajs and inspect its structure
    const esewaModule = await import("esewajs");
    console.log("esewajs module structure:", esewaModule);

    // Attempt to access Esewa (try default export first, then named export)
    const Esewa = esewaModule.default || esewaModule.Esewa;
    if (!Esewa) {
      throw new Error("Esewa class not found in esewajs module");
    }

    const esewa = new Esewa(esewaConfig.merchantId, esewaConfig.secretKey, {
      sandbox: esewaConfig.testMode,
    });

    transaction = await sequelize.transaction();

    // Find the order
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: "OrderItems" }],
      transaction,
    });

    if (!order) {
      throw new Error("Order not found");
    }
    if (order.buyerId !== buyerId) {
      throw new Error("Unauthorized");
    }
    if (order.paymentMethod !== "Online Payment") {
      throw new Error("This order does not require online payment");
    }
    if (order.paymentStatus !== "Pending") {
      throw new Error("Payment is not pending for this order");
    }

    // Verify all items are processed
    const allItemsProcessed = order.OrderItems.every(
      (item) => item.status === "Accepted" || item.status === "Declined"
    );
    if (!allItemsProcessed) {
      throw new Error("Some order items are still pending farmer confirmation");
    }

    const hasAcceptedItems = order.OrderItems.some(
      (item) => item.status === "Accepted"
    );
    if (!hasAcceptedItems) {
      throw new Error("No items have been accepted by farmers yet");
    }

    const amount = order.totalAmount;
    const taxAmount = 0; // Adjust if tax is applicable
    const totalAmount = amount + taxAmount;
    const productId = uuidv4();

    // Create payment transaction
    const paymentTransaction = await PaymentTransaction.create(
      {
        productId,
        amount: totalAmount,
        status: "Pending",
        paymentMethod: "Online Payment",
        buyerId,
        orderId,
      },
      { transaction }
    );

    // Generate eSewa payment parameters
    const paymentData = {
      amount: amount.toString(),
      tax_amount: taxAmount.toString(),
      total_amount: totalAmount.toString(),
      transaction_uuid: productId,
      product_code: esewaConfig.merchantId,
      success_url: "http://localhost:3000/success",
      failure_url: "http://localhost:3000/failure",
    };

    // Generate signature
    const signature = esewa.generateSignature({
      amount: paymentData.amount,
      tax_amount: paymentData.tax_amount,
      total_amount: paymentData.total_amount,
      transaction_uuid: paymentData.transaction_uuid,
      product_code: paymentData.product_code,
    });

    paymentData.signature = signature;

    const paymentUrl = esewaConfig.testMode
      ? "https://uat.esewa.com.np/epay/main"
      : "https://esewa.com.np/epay/main";

    await transaction.commit();

    return res.status(200).json({
      Success: true,
      Result: { paymentData, paymentUrl },
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Payment initiation error:", error);
    return res.status(500).json({
      Success: false,
      ErrorMessage: error.message || "Failed to initiate payment",
    });
  }
};

// Verify payment status with eSewa
const checkPaymentStatus = async (req, res) => {
  const { productId, status } = req.body;
  const buyerId = req.user.id;

  let transaction;

  try {
    transaction = await sequelize.transaction();

    const paymentTransaction = await PaymentTransaction.findOne(
      {
        where: { productId, buyerId },
      },
      { transaction }
    );

    if (!paymentTransaction) {
      throw new Error("Payment transaction not found");
    }

    // Simulate eSewa transaction verification
    // In production, make an API call to eSewa's verification endpoint
    let isVerified = false;
    try {
      const verificationResponse = await axios.get(
        esewaConfig.verificationUrl,
        {
          params: {
            amt: paymentTransaction.amount,
            psc: 0,
            pdc: 0,
            scd: esewaConfig.merchantId,
            pid: productId,
            tAmt: paymentTransaction.amount,
          },
        }
      );

      // Check response (simplified; adjust based on actual eSewa API response)
      isVerified = verificationResponse.data.status === "success";
    } catch (error) {
      console.error("eSewa verification error:", error);
      throw new Error("Failed to verify payment with eSewa");
    }

    if (status === "Failed" || !isVerified) {
      paymentTransaction.status = "Failed";
      await paymentTransaction.save({ transaction });

      await transaction.commit();

      return res.status(400).json({
        Success: false,
        ErrorMessage: "Payment verification failed",
      });
    }

    // Update transaction and order status
    paymentTransaction.status = "Completed";
    await paymentTransaction.save({ transaction });

    const order = await Order.findByPk(paymentTransaction.orderId, {
      transaction,
    });

    if (order) {
      order.paymentStatus = "Completed";
      order.status = "Confirmed";
      await order.save({ transaction });
    }

    // Send email notification (reusing sendEmail from orderController.js)
    const { sendEmail } = require("./orderController");
    const buyer = await require("../Models/user").findByPk(buyerId, {
      transaction,
    });
    await sendEmail(
      buyer.email,
      "Payment Successful",
      `Your payment for order ${order.orderNumber} was successful!`
    );

    // Emit Socket.IO notification
    const io = req.app.get("io");
    io.to(`user_${buyerId}`).emit("notification", {
      message: `Payment for order ${order.orderNumber} was successful!`,
      type: "Payment",
    });

    await transaction.commit();

    return res.status(200).json({
      Success: true,
      Result: { message: "Payment verified successfully" },
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Payment verification error:", error);
    return res.status(500).json({
      Success: false,
      ErrorMessage: error.message || "Failed to verify payment",
    });
  }
};

module.exports = {
  initiatePayment,
  checkPaymentStatus,
};
