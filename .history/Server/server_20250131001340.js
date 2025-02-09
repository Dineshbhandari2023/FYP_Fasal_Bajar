// Requiring dev dependencies
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const saltRounds = 10;

// Load environment variables
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5174", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies if needed
  })
);
app.use(cookieParser());

// Create MySQL database connection
const db = mysql.createConnection({
  user: "root",
  password: "Dinesh@123",
  host: "localhost",
  database: "fasal_bajar",
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
  console.log("Connected to the database.");
});

// Creating a route to register a user
app.post("/register", (req, res) => {
  // Insert user into the database
  const sql =
    "INSERT INTO users (username, email, password, role, contact_number, location) VALUES (?, ?, ?, ?, ?, ?)";

    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Error hashing password" });
      }
  const values = [
    req.body.username,
    req.body.email,
    bcrypt.hashSync(req.body.password, saltRounds),
    req.body.role,
    parseInt(req.body.contact_number, 10),
    req.body.location,
  ];

  // const values = [
  //   username,
  //   email,
  //   hashedPassword,
  //   role,
  //   contact_number,
  //   location,
  // ];
  // const { username, email, password, role, contact_number, location } =
  //   req.body;

  // // Validate required fields
  // if (
  //   !username ||
  //   !email ||
  //   !password ||
  //   !role ||
  //   !contact_number ||
  //   !location
  // ) {
  //   return res.status(400).json({ message: "All fields are required" });
  // }

  // // Validate contact_number is numeric
  // if (!/^\d+$/.test(contact_number)) {
  //   return res.status(400).json({ message: "Contact number must be numeric" });
  // }

  // // Check if the email already exists
  // const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  // db.query(checkEmailQuery, [email], (err, results) => {
  //   if (err) {
  //     console.error("Database error during email check:", err);
  //     return res.status(500).json({ message: "Database error", error: err });
  //   }

  //   if (results.length > 0) {
  //     return res
  //       .status(400)
  //       .json({ message: "Email is already registered. Please log in." });
  //   }

  //     db.query(sql, values, (err, results) => {
  //       if (err) {
  //         console.error("Database error during user registration:", err);
  //         return res.status(500).json({
  //           message: "Database error during user registration",
  //           error: err,
  //         });
  //       }

  //       res.status(201).json({ message: "User registered successfully" });
  //     });
  //   });
  // });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password, userType } = req.body;

  // Validate required fields
  if (!email || !password || !userType) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the user exists in the database
  const sql = "SELECT * FROM users WHERE email = ? AND role = ?";
  db.query(sql, [email, userType], (err, results) => {
    if (err) {
      console.error("Database error during login:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or role" });
    }

    const user = results[0];

    // Compare the hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ message: "Error during login" });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate JWT token (optional)
      const token = jwt.sign(
        { id: user.userid, email: user.email, role: user.role },
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "1h" }
      );

      // Send response
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.userid,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    });
  });
});
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port} - ${process.env.NODE_ENV}`);
});
