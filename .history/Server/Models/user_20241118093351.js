// const mongoose = require("mongoose");

const cors = require("cors");
// user schema

// Virtual fields

// methods
const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "mysql",
});

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
const sequelize = new Sequelize("database", "username", "password");
