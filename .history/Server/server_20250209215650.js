const express = require("express");
const sequelize = require("./Util/database");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const { errorHandler } = require("./Middlewares/errorHandler");
const cors = require("cors");

// Import Models
const User = require("./Models/User");

dotenv.config();

const app = express();

// Body parser
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CORS
app.use((req, res, next) => {
  cors({
    origin: "http://localhost:3000", // Change this if your frontend is hosted elsewhere
    credentials: true, // Allow cookies to be sent with requests
  });
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  console.log("Incoming Request Body:", req.body);
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Route files
const users = require("./routes/users");
const profiles = require("./routes/profiles");

// Mount routers
app.use(users);
app.use(profiles);

const PORT = process.env.PORT || 8000;

app.use(errorHandler);

const sync = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synced successfully.".green.bold);

    await User.create({
      email: "test@test.com",
      password: "123456",
      username: "neo",
      role: "Farmer",
      contact_number: 9876543210,
      location: "Kathmandu",
    });

    await User.create({
      email: "test2@test.com",
      password: "123456",
      username: "celeb_neo",
      role: "Buyer",
      contact_number: 9812345678,
      location: "Pokhara",
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`.cyan.bold);
    });
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

sync();
