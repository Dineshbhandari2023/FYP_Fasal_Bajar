// Import dependencies
const express = require("express");
const mysql = require("mysql2"); // Use `mysql2` for better compatibility
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const saltRounds = 10;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fasal_bajar",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
  console.log("Connected to the database.");
});

// API Routes

// Register User
app.post("/register", (req, res) => {
  const { username, email, password, role, contact_number, location } =
    req.body;

  // Validate required fields
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

  // Check if email already exists
  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Database error during email check:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ message: "Email is already registered. Please log in." });
    }

    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Error hashing password" });
      }

      // Insert user into the database
      const insertUserQuery =
        "INSERT INTO users (username, email, password, role, contact_number, location) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [
        username,
        email,
        hashedPassword,
        role,
        contact_number,
        location,
      ];

      db.query(insertUserQuery, values, (err, results) => {
        if (err) {
          console.error("Database error during user registration:", err);
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        res.status(201).json({ message: "User registered successfully" });
      });
    });
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} - ${process.env.NODE_ENV || "development"}`
  );
});
