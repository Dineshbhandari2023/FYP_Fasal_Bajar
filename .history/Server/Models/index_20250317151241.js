const User = require("./user");
const Product = require("./products");
const OrderItem = require("./orderItem");
const Order = require("./order");

const models = { User, Product, OrderItem, Order };

Object.keys(models).forEach((modelName) => {
  if (typeof models[modelName].associate === "function") {
    models[modelName].associate(models);
  }
});

module.exports = models;
