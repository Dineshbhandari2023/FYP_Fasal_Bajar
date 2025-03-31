const PaymentTransaction = require("../Models/paymentTransaction");
const { randomUUID } = require("crypto");

// Initiate Esewa Payment
const EsewaInitiatePayment = async (req, res) => {
  // Expect amount and productId (used as transactionId) in the request body
  const { amount, productId, paymentMethod, orderId } = req.body;
  // Use productId if provided; otherwise, generate a new UUID
  const transactionId = productId || randomUUID();

  try {
    // Dynamically import EsewaPaymentGateway from esewajs
    const { EsewaPaymentGateway } = await import("esewajs");
    const reqPayment = await EsewaPaymentGateway(
      amount, // total amount
      0, // product_delivery_charge
      0, // product_service_charge
      0, // tax_amount
      transactionId, // transaction_uuid (must be defined)
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL,
      undefined,
      undefined
    );

    if (!reqPayment) {
      return res.status(400).json({ message: "Error sending payment request" });
    }

    if (reqPayment.status === 200) {
      // Save transaction in database
      const transaction = await PaymentTransaction.create({
        transactionId, // store the generated/received transactionId
        amount,
        orderId, // for online payment, orderId might be set later
        paymentMethod,
        status: "Pending",
      });

      console.log("Transaction saved successfully");
      return res.json({
        paymentUrl: reqPayment.request.res.responseUrl,
        transaction,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Payment request failed", data: reqPayment });
    }
  } catch (error) {
    console.error("Error initiating Esewa payment:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Check Payment Status
const paymentStatus = async (req, res) => {
  const { transactionId } = req.body;

  try {
    // Find the transaction in the database
    const transaction = await PaymentTransaction.findOne({
      where: { transactionId },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Dynamically import EsewaCheckStatus from esewajs
    const { EsewaCheckStatus } = await import("esewajs");
    const paymentStatusCheck = await EsewaCheckStatus(
      transaction.amount,
      transaction.transactionId,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (paymentStatusCheck.status === 200) {
      // Update transaction status in the database
      transaction.status = paymentStatusCheck.data.status;
      await transaction.save();

      return res.json({
        message: "Transaction status updated",
        status: transaction.status,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Failed to retrieve payment status" });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = { EsewaInitiatePayment, paymentStatus };
