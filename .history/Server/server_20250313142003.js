const express = require("express");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const sequelize = require("./config/dbConfig");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const { errorHandler } = require("./Middlewares/errorHandler");
const cors = require("cors");

// Import Models
const User = require("./Models/user");
const Product = require("./Models/products");

dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Use cookie-parser to read cookies
app.use(cookieParser());

// Serve static files from the uploads folder
app.use("/uploads", express.static("uploads"));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const allowedOrigins = ["http://localhost:5176"];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., Postman) or if the origin is allowed
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
};

app.use(cors(corsOptions));

// Route files
const usersRoutes = require("./Routes/usersRoutes");
const productRoutes = require("./Routes/productRoutes");

// Mount routers with prefixes
app.use("/users", usersRoutes);
app.use("/products", productRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const sync = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synced successfully.".green.bold);
    // ... (initial user creation code)
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`.cyan.bold);
    });
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

sync();
