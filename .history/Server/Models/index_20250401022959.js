// Models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/dbConfig");

// Initialize Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Instantiate all models by calling the model functions with sequelize and DataTypes
const User = require("./user")(sequelize, DataTypes);
const Product = require("./products")(sequelize, DataTypes);
const Order = require("./order")(sequelize, DataTypes);
const OrderItem = require("./orderItem")(sequelize, DataTypes);
const Review = require("./review")(sequelize, DataTypes);
const Category = require("./category")(sequelize, DataTypes);
const Message = require("./message")(sequelize, DataTypes);
const Notification = require("./notification")(sequelize, DataTypes);
const PaymentTransaction = require("./paymentTransaction")(
  sequelize,
  DataTypes
);

// Build the models object for associations
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

// Call associate if defined for each model to setup relationships
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
    console.log(`${modelName} associated successfully.`);
  }
});

module.exports = { sequelize, ...models };
