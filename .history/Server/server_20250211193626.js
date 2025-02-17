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

const allowedOrigins = ["http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));

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
    await sequelize.sync({});
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
