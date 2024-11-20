const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
require("dotenv").config();

const app = express();

app.use(express.json());

// App Middleware
app.use(morgan("dev"));
app.use(cors());

// import routes
const authRoutes = require("./Routes/auth");

// Middleware
app.use("/api", authRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
