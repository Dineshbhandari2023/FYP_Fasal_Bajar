// Requiring dev dependencies
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

// Load environment variables
require("dotenv").config();

const app = express();

app.use(express.json());

// App Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors()); // this will allow all origins to be cached
if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: "http://localhost:5173" }));
}

// import routes
const authRoutes = require("./Routes/auth");

// Middleware
app.use("/api", authRoutes);

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`Server running on port ${port} - ${process.env.NODE_ENV}`);
});
