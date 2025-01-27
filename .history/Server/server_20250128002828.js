// Requiring dev dependencies
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const salt = 10;

// Load environment variables
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies if needed
  })
);
app.use(cookieParser());

// Create mysql database connection
const db = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  database: "fasal bajar",
});

// creating a route to the server
app.post("/register", (req, res) => {
  const { username, email, password, role, contact_number, location } =
    req.body;

  if (
    !username ||
    !email ||
    !password ||
    !role ||
    !contact_number ||
    !location
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate contact_number is numeric
  if (!Number.isInteger(Number(contact_number))) {
    return res.status(400).json({ message: "Invalid contact number" });
  }

  // Hash the password and save user to database
  bcrypt.hash(password, salt, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: "Error hashing password" });
    }
    if (!Number.isInteger(Number(contactNumber))) {
      return res.status(400).json({ message: "Invalid contact number" });
    }

    const sql =
      "INSERT INTO users (username, email, password, role, contact_number, location) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      username,
      email,
      hashedPassword,
      role,
      contact_number,
      location,
    ];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port} - ${process.env.NODE_ENV}`);
});
