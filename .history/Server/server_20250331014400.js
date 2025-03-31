const express = require("express");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./Middlewares/errorHandler");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const PaymentTransaction = require("./Models/paymentTransaction");
const { generateHmacSha256Hash } = require("./Middlewares/paymentHelper");
const axios = require("axios");

// Load environment variables
dotenv.config();

// Initialize Sequelize and models
const {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
} = require("./Models/index");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "public/data/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const server = http.createServer(app);

// Set up Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error("Authentication error"));
      socket.user = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  if (socket.user?.user_id) {
    socket.join(`user:${socket.user.user_id}`);
    console.log(`User ${socket.user.user_id} joined their private room`);
  }

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.set("io", io);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/data/uploads"))
);

// Morgan logger
if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

// Route imports
const usersRoutes = require("./Routes/usersRoutes");
const productRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/orderRoutes");

// Mount routers
app.use("/users", usersRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// Error handler
app.use(errorHandler);

// Route to initiate payment
app.post("/initiate-payment", async (req, res) => {
  const { amount, orderId, transactionUUID } = req.body;
  let paymentData = {
    amount,
    failure_url: process.env.FAILURE_URL,
    product_delivery_charge: "0",
    product_service_charge: "0",
    product_code: process.env.MERCHANT_ID, // Ensure this is defined in your .env
    signed_field_names: "total_amount,transaction_uuid,product_code",
    success_url: process.env.SUCCESS_URL,
    tax_amount: "0",
    total_amount: amount,
    transaction_uuid: transactionUUID, // Use the new unique value here
  };

  const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
  const signature = generateHmacSha256Hash(data, process.env.SECRET);
  paymentData = { ...paymentData, signature };

  try {
    const payment = await axios.post(process.env.ESEWAPAYMENT_URL, null, {
      params: paymentData,
    });
    console.log("Payment response:", payment.data);
    if (payment.status === 200 && payment.data.responseUrl) {
      // Optionally, save a payment transaction record here.
      return res.status(200).json({ url: payment.data.responseUrl });
    } else {
      return res.status(500).json({ message: "Payment initiation failed" });
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
    res
      .status(500)
      .json({ message: "Payment initiation error", error: error.message });
  }
});

// Route to handle payment status update
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
    const newOrder = await createOrderAfterPayment(
      cartData,
      shippingDetails,
      transactionId
    );
    return res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } else {
    return res.status(400).json({ message: "Payment failed" });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;

const sync = async () => {
  try {
    await sequelize.sync();
    console.log("Database synced successfully.".green.bold);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`.cyan.bold);
      console.log(`Socket.IO server initialized`.yellow.bold);
    });
  } catch (error) {
    console.error("Database sync error:", error);
  }
};

sync();

module.exports = { app, server, io };
