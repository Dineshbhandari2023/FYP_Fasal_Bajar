const express = require("express");
const sequelize = require("./Util/database");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const { errorHandler } = require("./Middlewares/errorHandler");
const cors = require("cors");
const router = express.Router();
const productRoutes = require("./routes/product-routes");
const productController = require("./controllers/ProductController");

// Import Models
const User = require("./Models/user");
const Product = require("./Models/products");

dotenv.config();

const app = express();

// Body parser
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const allowedOrigins = ["http://localhost:5175"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

// Route files
const users = require("./Routes/users");
const profiles = require("./Routes/profiles");
const product = require("./Models/products");

// Mount routers
app.use(users);
app.use(profiles);
app.use(product);

const PORT = process.env.PORT || 8000;

app.use(errorHandler);

const sync = async () => {
  try {
    await sequelize.sync({ alter: true }); // Keeps existing data and updates schema
    console.log("Database synced successfully.".green.bold);

    // Check if users exist before inserting
    const userCount = await User.count();
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
