// Models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

// Models/index.js
// const sequelize = require("../config/dbConfig");

// Import models without invoking them as functions.
// Make sure each model file (e.g. products.js, order.js, etc.) exports the model instance
// (created using sequelize.define or by calling Model.init) rather than a factory function.
const User = require("./user");
const Product = require("./products");
const Order = require("./order");
const OrderItem = require("./orderItem");
const Review = require("./review");
const Category = require("./category");
const Message = require("./message");
const Notification = require("./notification");
const PaymentTransaction = require("./paymentTransaction");

const models = {
  User,
  Product,
  Order,
  OrderItem,
  Review,
  Category,
  Message,
  Notification,
  PaymentTransaction,
};

Object.keys(models).forEach((modelName) => {
  if (typeof models[modelName].associate === "function") {
    models[modelName].associate(models);
    console.log(`${modelName} associated successfully.`);
  }
});

module.exports = { sequelize, ...models };
