// const express = require("express");
// const cookieParser = require("cookie-parser"); // Import cookie-parser
// const sequelize = require("./config/dbConfig");
// const dotenv = require("dotenv");
// const morgan = require("morgan");
// const colors = require("colors");
// const { errorHandler } = require("./Middlewares/errorHandler");
// const cors = require("cors");
// const path = require("path");
// const fs = require("fs");

// // Import Models
// const User = require("./Models/user");
// const Product = require("./Models/products");

// const uploadDir = path.join(__dirname, "public/data/uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// dotenv.config();

// const app = express();

// // Body parser
// app.use(express.json());

// // Use cookie-parser to read cookies
// app.use(cookieParser());

// // Serve static files from the uploads folder
// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "public/data/uploads"))
// );

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// const allowedOrigins = ["http://localhost:5176"];
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (e.g., Postman) or if the origin is allowed
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
//   allowedHeaders: ["Authorization", "Content-Type"],
// };

// app.use(cors(corsOptions));

// // Route files
// const usersRoutes = require("./Routes/usersRoutes");
// const productRoutes = require("./Routes/productRoutes");

// // Mount routers with prefixes
// app.use("/users", usersRoutes);
// app.use("/products", productRoutes);

// // Error handling middleware
// app.use(errorHandler);

// const PORT = process.env.PORT || 8000;

// const sync = async () => {
//   try {
//     await sequelize.sync({ alter: true });
//     console.log("Database synced successfully.".green.bold);
//     // ... (initial user creation code)
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`.cyan.bold);
//     });
//   } catch (error) {
//     console.error("Error syncing database:", error);
//   }
// };

// sync();

const express = require("express");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/dbConfig");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const { errorHandler } = require("./Middlewares/errorHandler");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");

// Import Models
const User = require("./Models/user");
const Product = require("./Models/products");
const Order = require("./Models/order");
const OrderItem = require("./Models/orderItem");

const uploadDir = path.join(__dirname, "public/data/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

dotenv.config();

const app = express();
const server = http.createServer(app);

// Set up Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5176",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO middleware for authentication
io.use((socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) return next(new Error("Authentication error"));
        socket.user = decoded;
        next();
      }
    );
  } else {
    next(new Error("Authentication error"));
  }
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join user-specific room for private messages
  if (socket.user && socket.user.user_id) {
    socket.join(`user:${socket.user.user_id}`);
    console.log(`User ${socket.user.user_id} joined their private room`);
  }

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Make io accessible to our routes
app.set("io", io);

// Body parser
app.use(express.json());

// Use cookie-parser to read cookies
app.use(cookieParser());

// Serve static files from the uploads folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/data/uploads"))
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5176"];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., Postman) or if the origin is allowed
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
};

app.use(cors(corsOptions));

// Route files
const usersRoutes = require("./Routes/usersRoutes");
const productRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/orderRoutes");

// Mount routers with prefixes
app.use("/users", usersRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

// Set up associations
const models = { User, Product, Order, OrderItem };
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

const sync = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synced successfully.".green.bold);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`.cyan.bold);
      console.log(`Socket.IO server initialized`.yellow.bold);
    });
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

sync();

// Export for testing purposes
module.exports = { app, server, io };
