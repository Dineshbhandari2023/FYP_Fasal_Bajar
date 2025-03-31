// In server.js or a paymentController.js
const { generateHmacSha256Hash } = require("../Middlewares/paymentHelper");
const PaymentTransaction = require("../Models/paymentTransaction");

app.post("/initiate-payment", async (req, res) => {
  const { amount, cartData } = req.body; // you may send minimal info here
  const transaction_uuid = /* generate a temporary transaction ID, e.g., a UUID */;
  
  let paymentData = {
    amount,
    failure_url: process.env.FAILURE_URL,
    product_delivery_charge: "0",
    product_service_charge: "0",
    product_code: process.env.MERCHANT_ID,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    success_url: process.env.SUCCESS_URL, // this should point to your frontend payment success page
    tax_amount: "0",
    total_amount: amount,
    transaction_uuid,
  };
  
  const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
  const signature = generateHmacSha256Hash(data, process.env.SECRET);
  paymentData = { ...paymentData, signature };

  try {
    const payment = await axios.post(process.env.ESEWAPAYMENT_URL, null, {
      params: paymentData,
    });
    // Save a payment transaction record in pending status if needed
    const transaction = await PaymentTransaction.create({
      transactionId: transaction_uuid,
      amount,
      status: "Pending",
      paymentMethod: "Online Payment",
    });
    return res.status(200).json({ url: payment.request.res.responseUrl, transactionId: transaction_uuid });
  } catch (error) {
    return res.status(500).json({ message: "Payment initiation failed", error: error.message });
  }
});

app.post("/payment-status", async (req, res) => {
  const { orderId } = req.body; // Extract data from request body
  try {
    // Find the transaction by its signature
    const transaction = await PaymentTransaction.findOne({ orderId: orderId });
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }
    const paymentData = {
      product_code: "EPAYTEST",
      total_amount: transaction.amount,
      transaction_uuid: transaction.product_id,
    };
    const response = await axios.get(
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL,
      {
        params: paymentData,
      }
    );
    const paymentStatusCheck = JSON.parse(safeStringify(response));
    if (paymentStatusCheck.status === 200) {
      // Update the transaction status
      transaction.status = paymentStatusCheck.data.status;
      await transaction.save();
      res
        .status(200)
        .json({ message: "Transaction status updated successfully" });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


app.post("/payment-success", async (req, res) => {
    // The payment gateway should pass necessary details (e.g., transaction ID, status, etc.)
    const { transactionId, paymentStatus, cartData, shippingDetails } = req.body;
    
    // Verify payment status with eSewa using your status check API if needed.
    
    if (paymentStatus === "COMPLETE") {
      // Now create the order using the existing createOrder logic.
      // You might extract cartData and shippingDetails from the request.
      // Call your order creation service here.
      
      // For example, assuming you have a function createOrderAfterPayment:
      const newOrder = await createOrderAfterPayment(cartData, shippingDetails, transactionId);
      return res.status(201).json({ message: "Order created successfully", order: newOrder });
    } else {
      return res.status(400).json({ message: "Payment failed" });
    }
  });
  
