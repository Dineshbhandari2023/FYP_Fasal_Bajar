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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

// Route imports
const usersRoutes = require("./Routes/usersRoutes");
const productRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const reviewRoutes = require("./Routes/reviewRoutes");

// Mount routers
app.use("/users", usersRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/", paymentRoutes);
app.use("/reviews", reviewRoutes);
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
