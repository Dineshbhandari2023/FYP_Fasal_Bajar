const express = require("express");
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
// app.use(express.json({ limit: 50 * 1000 * 1000 }), cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const allowedOrigins = ["http://localhost:5174"];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
//   allowedHeaders: ["Authorization", "Content-Type"],
// };

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman) or if the origin is allowed
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

// Mount routers
app.use(usersRoutes);
app.use(productRoutes);

const PORT = process.env.PORT || 8000;

app.use(errorHandler);

const sync = async () => {
  try {
    // await sequelize.sync({ alter: true });
    await sequelize.sync({ force: true });
    console.log("Database synced successfully.".green.bold);

    // Check if users and product exist before inserting
    const userCount = await User.count();
    const productCount = await Product.count();

    if (userCount === 0) {
      await User.create({
        email: "test@gmail.com",
        password: "123456",
        username: "Saujal",
        role: "Farmer",
        contact_number: 9876543210,
        location: "Kathmandu",
      });

      await User.create({
        email: "test2@gmail.com",
        password: "123456",
        username: "celeb_neo",
        role: "Buyer",
        contact_number: 9812345678,
        location: "Pokhara",
      });
      console.log("Initial users created.".yellow.bold);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`.cyan.bold);
    });
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};
sync();
