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

// Create MySQL database connection
const db = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  database: "fasal bajar",
});

// // Test database connection
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err);
//     process.exit(1);
//   }
//   console.log("Connected to the database.");
// });

// Creating a route to register a user
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

  // Check if the email already exists
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
    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Error hashing password" });
      }

      // Insert user into the database
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
          console.error("Database error during user registration:", err);
          return res.status(500).json({
            message: "Database error during user registration",
            error: err,
          });
        }

        res.status(201).json({ message: "User registered successfully" });
      });
    });
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port} - ${process.env.NODE_ENV}`);
});
