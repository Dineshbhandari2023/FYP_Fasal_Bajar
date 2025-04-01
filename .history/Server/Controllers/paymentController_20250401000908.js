// paymentController.js
const { PaymentTransaction, Order } = require("../Models/index"); // Ensure Order is imported
const axios = require("axios");

const initiatePayment = async (req, res) => {
  const { amount, productId } = req.body;

  if (!amount || isNaN(amount) || !productId) {
    console.error("Invalid data provided:", req.body);
    return res
      .status(400)
      .json({ error: "Invalid payment amount or missing product ID." });
  }

  try {
    const { EsewaPaymentGateway } = await import("esewajs");

    const paymentResponse = await EsewaPaymentGateway(
      amount,
      0,
      0,
      0,
      productId, // using productId as per Esewa gateway expectations
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL
    );

    if (paymentResponse.status === 200) {
      await PaymentTransaction.create({
        productId,
        amount,
        paymentMethod: "Online Payment",
        status: "Pending",
      });

      return res.status(200).json({
        paymentUrl: paymentResponse.request.res.responseUrl,
        params: {}, // if Esewa needs additional params (empty if not required)
      });
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
  const { productId } = req.body; // productId here should be the orderNumber (transaction_uuid)

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required." });
  }

  try {
    const { EsewaCheckStatus } = await import("esewajs");

    // Find the PaymentTransaction associated with this productId (orderNumber)
    const transaction = await PaymentTransaction.findOne({
      where: { productId },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    // Check payment status with Esewa
    const paymentStatusResponse = await EsewaCheckStatus(
      transaction.amount,
      transaction.productId,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (paymentStatusResponse.status === 200) {
      // Update PaymentTransaction status based on Esewa's response
      transaction.status =
        paymentStatusResponse.data.status === "COMPLETE"
          ? "Completed"
          : "Failed";
      await transaction.save();

      // If payment is complete, update the corresponding Order record:
      if (paymentStatusResponse.data.status === "COMPLETE") {
        // Find the order using the orderNumber which is the same as productId
        const order = await Order.findOne({
          where: { orderNumber: productId },
        });
        console.log("Payment order found");

        console.log(order.OrderNumber);

        if (order) {
          order.paymentStatus = "Completed";
          order.status = "Pending"; // "Pending" indicates waiting for farmer approval
          await order.save();
        }
      }

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
