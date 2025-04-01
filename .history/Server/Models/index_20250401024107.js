// Models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

// For models that are already defined and instantiated (like User), require them directly.
// For models that export a factory function, invoke them with (sequelize, DataTypes).
const User = require("./user"); // user.js already returns a model instance
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

// Associate models if an associate method is defined
Object.keys(models).forEach((modelName) => {
  if (typeof models[modelName].associate === "function") {
    models[modelName].associate(models);
    console.log(`${modelName} associated successfully.`);
  }
});

module.exports = { sequelize, ...models };
