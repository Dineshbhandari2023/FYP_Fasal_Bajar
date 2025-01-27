// Requiring dev dependencies
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

// Load environment variables
require("dotenv").config();

const app = express();

app.use(express.json());

// Create mysql database connection
const db = mysql.createConnection({
  user: "root",
  password: "your_password",
  host: "localhost",
  database: "fasal bajar",
});

// creating a route to the server
app,
  post("./register", (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const role = req.body.role;
    const contactNumber = req.body.contact_number;
    const location = req.body.location;
    const password = req.body.password;

    const SQL =
      "INSERT INTO users (name, email, password, role, 
      contact_number, location) VALUES (?, ?, ?, ?, ?,)"
  }); 

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`Server running on port ${port} - ${process.env.NODE_ENV}`);
});
