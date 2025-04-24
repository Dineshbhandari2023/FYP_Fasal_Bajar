const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Renamed from farmerId to userId
    },
    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Accepted",
        "Declined",
        "Shipped",
        "Delivered"
      ),
      allowNull: false,
      defaultValue: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

OrderItem.associate = (models) => {
  // Association with Order
  models.OrderItem.belongsTo(models.Order, { foreignKey: "orderId" });
  // Association with Product
  models.OrderItem.belongsTo(models.Product, { foreignKey: "productId" });
  // Association with User (the farmer)
  models.OrderItem.belongsTo(models.User, { foreignKey: "userId" });
};

module.exports = OrderItem;
