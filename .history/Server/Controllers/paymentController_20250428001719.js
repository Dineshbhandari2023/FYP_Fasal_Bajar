const { EsewaPaymentGateway, EsewaCheckStatus } = require("esewajs");
const {
  PaymentTransaction,
  sequelize,
} = require("../Models/paymentTransaction");
const { Order } = require("../Models/order"); // Adjust path to your Order model
const { v4: uuidv4 } = require("uuid");

// Initiate payment for an order
exports.initiatePayment = async (req, res) => {
  const { orderId } = req.params;
  const user = req.user; // From authMiddleware

  try {
    // Find the order
    const order = await Order.findOne({
      where: { id: orderId, buyerId: user.id },
      include: [{ model: OrderItem, as: "OrderItems" }], // Adjust based on your model association
    });

    if (!order) {
      return res.status(404).json({ ErrorMessage: "Order not found" });
    }

    // Check if payment is eligible
    const hasAcceptedItems = order.OrderItems.some(
      (item) => item.status === "Accepted"
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
    });

    // Call EsewaPaymentGateway
    const paymentResponse = await EsewaPaymentGateway(
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

    if (paymentResponse.status !== 200) {
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
      signature: paymentResponse.signature, // Assuming EsewaPaymentGateway returns signature
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
  const { productId } = req.body;
  const user = req.user; // From authMiddleware

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

    // Check status with eSewa
    const statusResponse = await EsewaCheckStatus(
      paymentTransaction.amount,
      paymentTransaction.productId,
      process.env.ESEWA_MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (statusResponse.status !== 200) {
      await paymentTransaction.update({ status: "Failed" });
      return res
        .status(400)
        .json({ ErrorMessage: "Payment verification failed with eSewa" });
    }

    // Update transaction and order based on eSewa status
    const esewaStatus = statusResponse.data.status; // Assuming eSewa returns status like "COMPLETE"
    let transactionStatus;
    let orderStatus;

    switch (esewaStatus) {
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

      if (order) {
        await order.update({ paymentStatus: orderStatus }, { transaction: t });
      }
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
