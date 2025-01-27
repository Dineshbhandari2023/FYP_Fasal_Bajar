const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
require("dotenv").config();

const app = express();

// connect to Database
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Database connection Err...", err));

app.use(express.json());

// App Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors()); // this will allow all origins to be cached
if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: "http://localhost:5173);
}

// import routes
const authRoutes = require("./Routes/auth");

// Middleware
app.use("/api", authRoutes);

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`Server running on port ${port} - ${process.env.NODE_ENV}`);
});
