const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const PaymentTransaction = sequelize.define(
  "PaymentTransaction",
  {
    productId: { type: DataTypes.STRING, allowNull: false, unique: true }, // renamed from transactionId
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: {
      type: DataTypes.ENUM("Completed", "Failed", "Pending"),
      allowNull: false,
      defaultValue: "Pending",
    },
    paymentMethod: {
      type: DataTypes.ENUM("Cash on Delivery", "Online Payment"),
      allowNull: false,
      defaultValue: "Cash on Delivery",
    },
  },
  { timestamps: true }
);

module.exports = PaymentTransaction;
