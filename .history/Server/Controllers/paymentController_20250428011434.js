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
const {
  PaymentTransaction,
  Order,
  OrderItem,
  sequelize,
} = require("../Models/index");
const { Op } = require("sequelize");

const { v4: uuidv4 } = require("uuid");

// Initiate payment for an order
exports.initiatePayment = async (req, res) => {
  const { EsewaPaymentGateway } = await import("esewajs");
  const orderId = req.params.orderId;
  const user = req.user; // From authMiddleWare (User instance)

  if (!orderId) {
    return res.status(400).json({ ErrorMessage: "Order ID is required" });
  }

  try {
    // Find the order by id or orderNumber
    const order = await Order.findOne({
      where: {
        [Op.or]: [{ id: orderId }, { orderNumber: orderId }],
        buyerId: user.id,
      },
      include: [{ model: OrderItem, as: "OrderItems" }],
    });

    if (!order) {
      return res.status(404).json({ ErrorMessage: "Order not found" });
    }

    // Check if payment is eligible
    const hasAcceptedItems = order.OrderItems.some(
      (item) => item.status === "Accepted"
    );
    console.log(
      "OrderItems statuses:",
      order.OrderItems.map((item) => item.status)
    );
    if (
      !hasAcceptedItems ||
      order.paymentMethod !== "Online Payment" ||
      order.paymentStatus !== "Pending"
    ) {
      return res
        .status(400)
        .json({ ErrorMessage: "Order is not eligible for payment" });
    }

    // Generate transaction UUID
    const transactionUuid = uuidv4();

    // Calculate amounts
    const amount = order.totalAmount;
    const taxAmount = 0; // Adjust if you have tax logic
    const productDeliveryCharge = 0;
    const productServiceCharge = 0;

    // Create payment transaction
    const paymentTransaction = await PaymentTransaction.create({
      productId: transactionUuid,
      amount: amount,
      status: "Pending",
      paymentMethod: "Online Payment",
      buyerId: user.id,
      orderId: order.id,
    });
    console.log("Created PaymentTransaction:", paymentTransaction.toJSON());

    // Validate eSewa credentials
    if (!process.env.ESEWA_MERCHANT_ID || !process.env.ESEWA_SECRET) {
      throw new Error(
        "eSewa merchant ID or secret is missing in configuration"
      );
    }

    // Call EsewaPaymentGateway
    let paymentResponse;
    try {
      paymentResponse = await EsewaPaymentGateway(
        amount,
        productDeliveryCharge,
        productServiceCharge,
        taxAmount,
        transactionUuid,
        process.env.ESEWA_MERCHANT_ID,
        process.env.ESEWA_SECRET,
        `${process.env.SUCCESS_URL}?pid=${transactionUuid}`,
        `${process.env.FAILURE_URL}?pid=${transactionUuid}`,
        process.env.ESEWAPAYMENT_URL
      );
    } catch (esewaError) {
      console.error("eSewa payment gateway error:", esewaError);
      await paymentTransaction.update({ status: "Failed" });
      throw new Error(`eSewa payment initiation failed: ${esewaError.message}`);
    }

    if (!paymentResponse || paymentResponse.status !== 200) {
      await paymentTransaction.update({ status: "Failed" });
      return res
        .status(400)
        .json({ ErrorMessage: "Failed to initiate payment with eSewa" });
    }

    // Prepare payment data for frontend
    const paymentData = {
      amount: amount.toString(),
      tax_amount: taxAmount.toString(),
      total_amount: (amount + taxAmount).toString(),
      transaction_uuid: transactionUuid,
      product_code: process.env.ESEWA_MERCHANT_ID,
      signature: paymentResponse.signature || "",
    };

    return res.status(200).json({
      Result: {
        paymentData,
        paymentUrl: process.env.ESEWAPAYMENT_URL,
      },
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    return res.status(500).json({
      ErrorMessage: error.message || "Server error during payment initiation",
    });
  }
};
// Check payment status
exports.checkPaymentStatus = async (req, res) => {
  const { EsewaCheckStatus } = await import("esewajs");
  const { productId } = req.body;
  const user = req.user; // From authMiddleWare (User instance)

  if (!productId) {
    return res.status(400).json({ ErrorMessage: "Product ID is required" });
  }

  try {
    // Find the payment transaction
    const paymentTransaction = await PaymentTransaction.findOne({
      where: { productId, buyerId: user.id },
    });

    if (!paymentTransaction) {
      return res
        .status(404)
        .json({ ErrorMessage: "Payment transaction not found" });
    }

    console.log(
      "PaymentTransaction for status check:",
      paymentTransaction.toJSON()
    );

    // Check if orderId exists
    if (!paymentTransaction.orderId) {
      return res
        .status(400)
        .json({
          ErrorMessage: "Payment transaction is not linked to an order",
        });
    }

    // Validate eSewa credentials
    if (
      !process.env.ESEWA_MERCHANT_ID ||
      !process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    ) {
      throw new Error(
        "eSewa merchant ID or status check URL is missing in configuration"
      );
    }

    // Check status with eSewa
    let statusResponse;
    try {
      statusResponse = await EsewaCheckStatus(
        paymentTransaction.amount,
        paymentTransaction.productId,
        process.env.ESEWA_MERCHANT_ID,
        process.env.ESEWAPAYMENT_STATUS_CHECK_URL
      );
    } catch (esewaError) {
      console.error("eSewa status check error:", esewaError);
      throw new Error(`eSewa status check failed: ${esewaError.message}`);
    }

    if (!statusResponse || statusResponse.status !== 200) {
      await paymentTransaction.update({ status: "Failed" });
      return res
        .status(400)
        .json({ ErrorMessage: "Payment verification failed with eSewa" });
    }

    // Update transaction and order based on eSewa status
    const esewaStatus = statusResponse.data?.status || "FAILED";
    let transactionStatus;
    let orderStatus;

    switch (esewaStatus.toUpperCase()) {
      case "COMPLETE":
        transactionStatus = "Completed";
        orderStatus = "Paid";
        break;
      case "PENDING":
        transactionStatus = "Pending";
        orderStatus = "Pending";
        break;
      case "FAILED":
      case "CANCELLED":
        transactionStatus = "Failed";
        orderStatus = "Failed";
        break;
      default:
        transactionStatus = "Failed";
        orderStatus = "Failed";
    }

    // Start a transaction to update both PaymentTransaction and Order
    await sequelize.transaction(async (t) => {
      await paymentTransaction.update(
        { status: transactionStatus },
        { transaction: t }
      );

      const order = await Order.findOne({
        where: { id: paymentTransaction.orderId, buyerId: user.id },
        transaction: t,
      });

      if (!order) {
        throw new Error("Associated order not found");
      }

      await order.update({ paymentStatus: orderStatus }, { transaction: t });
    });

    return res.status(200).json({
      Result: { message: `Payment ${transactionStatus.toLowerCase()}` },
    });
  } catch (error) {
    console.error("Payment status check error:", error);
    return res.status(500).json({
      ErrorMessage: error.message || "Server error during payment verification",
    });
  }
};
