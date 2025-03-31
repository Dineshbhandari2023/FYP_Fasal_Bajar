const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const PaymentTransaction = sequelize.define(
  "PaymentTransaction",
  {
    transactionId: { type: DataTypes.STRING, allowNull: false, unique: true },
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
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Orders", key: "id" },
    },
  },
  { timestamps: true }
);

PaymentTransaction.associate = (models) => {
  PaymentTransaction.belongsTo(models.Order, { foreignKey: "orderId" });
};

module.exports = PaymentTransaction;
