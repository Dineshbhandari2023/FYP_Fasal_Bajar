const { PaymentTransaction, Order } = require("../Models/index");
const { sequelize } = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid");

const initiatePayment = async (
  amount,
  orderNumber,
  buyerId,
  paymentMethod,
  transaction
) => {
  try {
    const { EsewaPaymentGateway } = await import("esewajs");

    // Generate a unique productId for the transaction
    const productId = `${orderNumber}-${uuidv4()}`;

    // Create PaymentTransaction
    const paymentTransaction = await PaymentTransaction.create(
      {
        productId,
        amount,
        status: "Pending",
        paymentMethod,
        buyerId,
      },
      { transaction }
    );

    const paymentData = {
      amount,
      tax_amount: 0,
      total_amount: amount,
      product_code: productId,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: process.env.SUCCESS_URL,
      failure_url: process.env.FAILURE_URL,
      merchant_code: process.env.MERCHANT_ID,
    };

    const paymentResponse = await EsewaPaymentGateway(
      amount,
      0,
      0,
      0,
      productId,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.ESEWAPAYMENT_URL
    );

    if (paymentResponse.status !== 200) {
      throw new Error("Payment initiation failed at gateway");
    }

    return {
      paymentTransaction,
      paymentUrl: paymentResponse.request.res.responseUrl,
    };
  } catch (error) {
    console.error("Payment initiation error:", error);
    throw error;
  }
};

const checkPaymentStatus = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  let transaction;
  try {
    transaction = await sequelize.transaction();

    const paymentTransaction = await PaymentTransaction.findOne(
      { where: { productId } },
      { transaction }
    );

    if (!paymentTransaction) {
      await transaction.rollback();
      return res.status(404).json({ error: "Transaction not found" });
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
        // Extract orderNumber from productId (before the UUID suffix)
        const orderNumber = productId.split("-")[0];
        const order = await Order.findOne(
          { where: { orderNumber } },
          { transaction }
        );

        if (order) {
          order.paymentStatus = "Completed";
          order.status = "Pending"; // Waiting for farmer processing
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
