const { PaymentTransaction, Order } = require("../Models/index");
const { sequelize } = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

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

    // Check for existing PaymentTransaction records for this order
    const existingTransaction = await PaymentTransaction.findOne({
      where: {
        buyerId,
        status: "Pending",
        orderNumber, // Match by orderNumber instead of productId
      },
      transaction,
    });

    let productId;
    let paymentTransaction;

    if (existingTransaction) {
      // If there's an existing pending transaction, delete it to avoid duplicates
      await existingTransaction.destroy({ transaction });
    }

    // Generate a completely random productId (transaction_uuid)
    productId = uuidv4();

    paymentTransaction = await PaymentTransaction.create(
      {
        productId,
        orderNumber, // Store the orderNumber separately
        amount,
        status: "Pending",
        paymentMethod,
        buyerId,
        paymentUrl: null,
      },
      { transaction }
    );

    const response = await EsewaPaymentGateway(
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

    const paymentData = response.config.params;

    console.log("Extracted paymentData:", paymentData);

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

    console.log("Payment status response:", paymentStatusResponse);

    if (paymentStatusResponse.status === 200) {
      const newStatus =
        paymentStatusResponse.data.status === "COMPLETE"
          ? "Completed"
          : "Failed";
      paymentTransaction.status = newStatus;
      await paymentTransaction.save({ transaction });

      if (newStatus === "Completed") {
        const order = await Order.findOne(
          { where: { orderNumber: paymentTransaction.orderNumber } }, // Use orderNumber
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
