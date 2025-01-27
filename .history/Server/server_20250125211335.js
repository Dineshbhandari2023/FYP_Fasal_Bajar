// server.js
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

// Create MySQL database connection
const db = mysql.createConnection({
  user: "root",
  password: "your_password",
  host: "localhost",
  database: "fasal_bajar",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
  console.log("Connected to the MySQL database.");
});

// Register route
app.post("/register", (req, res) => {
  const { name, email, password, role, contact_number, location } = req.body;

  const SQL =
    "INSERT INTO users (name, email, password, role, contact_number, location) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    SQL,
    [name, email, password, role, contact_number, location],
    (err, results) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(201).json({ message: "User registered successfully" });
    }
  );
});

// Fetch all users
app.get("/register", (req, res) => {
  const SQL = "SELECT * FROM users";
  db.query(SQL, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port} - ${process.env.NODE_ENV}`);
});
