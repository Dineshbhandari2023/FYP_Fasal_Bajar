// const mongoose = require("mongoose");
const { Sequelize } = require("sequelize");
const crypto = require("crypto");
// user schema
// Virtual fields
// methods

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "mysql",
});
