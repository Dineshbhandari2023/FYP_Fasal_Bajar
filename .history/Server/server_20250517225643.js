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
const setupMessageSocket = require("./Sockets/messageSockets");

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
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// const io = socketIo(server, {
//   cors: {
//     origin: "https://05fc-2001-df7-be80-abf-00-3.ngrok-free.app",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

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
    next(); // Allow unauthenticated connections for public features
  }
});

// Socket.IO connection handler for main namespace
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

// Import the review socket handler
const setupReviewSocket = require("./Sockets/reviewSockets");

// Set up review socket handlers
const reviewSocket = setupReviewSocket(io);
app.set("reviewSocket", reviewSocket);
app.set("io", io);

// Set up message socket handlers
const messageSocket = setupMessageSocket(io);
app.set("messageSocket", messageSocket);

const setupSupplierLocationSocket = require("./Sockets/Handlers/supplierLocationSockets");

const locationSocket = setupSupplierLocationSocket(io);
app.set("locationSocket", locationSocket);

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
  app.use(morgan("dev"));
}

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

// app.use(
//   cors({
//     origin: "https://a684-2001-df7-be80-abf-00-3.ngrok-free.app", // Frontend ngrok URL
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     credentials: true,
//     allowedHeaders: ["Authorization", "Content-Type"],
//   })
// );

// Route imports
const usersRoutes = require("./Routes/usersRoutes");
const productRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const reviewRoutes = require("./Routes/reviewRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const supplierRoutes = require("./Routes/supplierRoutes");
const supplierLocationRoutes = require("./Routes/supplierLocationRoutes");

// Mount routers
app.use("/users", usersRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/messages", messageRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/supplier/location", supplierLocationRoutes);

// Error handler
app.use(errorHandler);

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
