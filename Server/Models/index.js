const sequelize = require("../config/dbConfig");

const User = require("./user");
const Product = require("./products");
const Order = require("./order");
const OrderItem = require("./orderItem");

// Debug output
console.log({ User, Product, Order, OrderItem });

const models = { User, Product, Order, OrderItem };

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    try {
      models[modelName].associate(models);
      console.log(`${modelName} associated successfully.`);
    } catch (err) {
      console.error(`Error associating ${modelName}:`, err);
    }
  }
});

module.exports = { sequelize, ...models };
