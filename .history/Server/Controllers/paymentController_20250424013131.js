const { PaymentTransaction, Order } = require("../Models/index");
const { sequelize } = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid");

const requiredEnvVars = [
  "MERCHANT_ID",
  "SECRET",
  "ESEWAPAYMENT_URL",
  "ESEWAPAYMENT_STATUS_CHECK_URL",
  "SUCCESS_URL",
  "FAILURE_URL",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

const initiatePayment = async (
  amount,
  orderNumber,
  buyerId,
  paymentMethod,
  transaction,
  taxAmount = 0,
  serviceCharge = 0,
  deliveryCharge = 0
) => {
  try {
    const { EsewaPaymentGateway } = await import("esewajs");

    const productId = `${orderNumber}-${uuidv4()}`;

    const paymentTransaction = await PaymentTransaction.create(
      {
        productId,
        amount,
        status: "Pending",
        paymentMethod,
        buyerId,
        paymentUrl: null,
      },
      { transaction }
    );

    const paymentData = await EsewaPaymentGateway(
      amount,
      deliveryCharge,
      serviceCharge,
      taxAmount,
      productId,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL,
      "sha256",
      "base64"
    );

    return { paymentTransaction, paymentData };
  } catch (error) {
    console.error("Payment initiation error:", error);
    throw error;
  }
};

const checkPaymentStatus = async (req, res) => {
  const { productId } = req.body;
  const buyerId = req.user.id;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

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
      await transaction.rollback();
      return res
        .status(403)
        .json({ error: "Unauthorized or transaction not found" });
    }

    const { EsewaCheckStatus } = await import("esewajs");

    const paymentStatusResponse = await EsewaCheckStatus(
      paymentTransaction.amount,
      paymentTransaction.productId,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (paymentStatusResponse.status === 200) {
      const newStatus =
        paymentStatusResponse.data.status === "COMPLETE"
          ? "Completed"
          : "Failed";
      paymentTransaction.status = newStatus;
      await paymentTransaction.save({ transaction });

      if (newStatus === "Completed") {
        const orderNumber = productId.split("-")[0];
        const order = await Order.findOne(
          { where: { orderNumber } },
          { transaction }
        );

        if (order) {
          order.paymentStatus = "Completed";
          order.status = "Confirmed";
          await order.save({ transaction });
        }
      }

      await transaction.commit();
      return res.status(200).json({
        message: "Transaction status updated successfully",
        status: paymentTransaction.status,
      });
    } else {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: "Failed to fetch transaction status from Esewa" });
    }
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Payment status check error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { initiatePayment, checkPaymentStatus };
