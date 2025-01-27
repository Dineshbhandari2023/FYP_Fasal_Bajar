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
app.use(cors());
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
  const email = req.body.email;
  const name = req.body.name;
  const role = req.body.role;
  const contactNumber = req.body.contact_number;
  const location = req.body.location;
  const password = req.body.password;

  // Hashing the password
  bcrypt.hash(password, salt, (err, hashedPassword) => {
    if (err) {
      console.log(err);
    } else {
      // Insert into the database
      const sql = "INSERT INTO users (name, email, password, role, contact_number, location) VALUES (?,?,?,?,?,?)";
      const values = [name, email, hashedPassword, role, contactNumber, location];});

  db.query(sql, Values, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ message: "User registered successfully" });
    }
  });
});


const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port} - ${process.env.NODE_ENV}`);
});
