const esewaModule = await import("esewajs");
const { EsewaPaymentGateway, EsewaCheckStatus } = esewaModule;
const PaymentTransaction = require("../Models/paymentTransaction");

// Initiate Esewa Payment
const EsewaInitiatePayment = async (req, res) => {
  const { amount, transactionId, orderId, paymentMethod } = req.body; // Data from frontend

  try {
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
      return res.status(400).json({ message: "Error sending payment request" });
    }

    if (reqPayment.status === 200) {
      // Save transaction in database
      const transaction = await PaymentTransaction.create({
        transactionId,
        amount,
        orderId,
        paymentMethod,
        status: "Pending",
      });

      console.log("Transaction saved successfully");
      return res.json({
        paymentUrl: reqPayment.request.res.responseUrl,
        transaction,
      });
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
    // Find the transaction in database
    const transaction = await PaymentTransaction.findOne({
      where: { transactionId },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Check status from Esewa
    const paymentStatusCheck = await EsewaCheckStatus(
      transaction.amount,
      transaction.transactionId,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (paymentStatusCheck.status === 200) {
      // Update transaction status in database
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
