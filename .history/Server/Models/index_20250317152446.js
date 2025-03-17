const sequelize = require("../config/dbConfig");

const User = require("./user");
const Product = require("./products");
const Order = require("./order");
const OrderItem = require("./orderItem");

// Initialize Models object
const models = {
  User,
  Product,
  Order,
  OrderItem,
};

// Setup associations explicitly
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

// Export models with sequelize instance
module.exports = { sequelize, ...models };
