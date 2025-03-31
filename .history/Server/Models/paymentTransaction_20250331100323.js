const PaymentTransaction = require("../Models/paymentTransaction");
const { EsewaPaymentGateway, EsewaCheckStatus } = require("esewajs");

const EsewaInitiatePayment = async (req, res) => {
  const { amount, productId } = req.body; // data coming from frontend
  try {
    const reqPayment = await EsewaPaymentGateway(
      amount,
      0,
      0,
      0,
      productId,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL,
      undefined,
      undefined
    );
    if (!reqPayment) {
      return res.status(400).json("error sending data");
    }
    if (reqPayment.status === 200) {
      // Use orderId instead of product_id to match the model's field
      const transaction = new PaymentTransaction({
        orderId: productId,
        amount: amount,
      });
      await transaction.save();
      console.log("transaction passed");
      return res.send({
        url: reqPayment.request.res.responseUrl,
      });
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
    return res.status(400).json("error sending data");
  }
};

const paymentStatus = async (req, res) => {
  const { orderId } = req.body; // Extract orderId from request body
  try {
    // Find the transaction using the correct field
    const transaction = await PaymentTransaction.findOne({
      where: { orderId },
    });
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    const paymentStatusCheck = await EsewaCheckStatus(
      transaction.amount,
      transaction.orderId,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (paymentStatusCheck.status === 200) {
      // Update the transaction status based on the check result
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
