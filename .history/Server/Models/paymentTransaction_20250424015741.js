const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const PaymentTransaction = sequelize.define(
  "PaymentTransaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    orderNumber: {
      // Add this field
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Completed", "Failed", "Refunded"),
      allowNull: false,
      defaultValue: "Pending",
    },
    paymentMethod: {
      type: DataTypes.ENUM("Online Payment", "Cash on Delivery"),
      allowNull: false,
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = PaymentTransaction;
