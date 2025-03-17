const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Order = sequelize.define(
  "Order",
  {
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "Processing",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Declined"
      ),
      allowNull: false,
      defaultValue: "Processing",
    },
    paymentMethod: {
      type: DataTypes.ENUM("Cash on Delivery", "Online Payment"),
      allowNull: false,
      defaultValue: "Cash on Delivery",
    },
    paymentStatus: {
      type: DataTypes.ENUM("Pending", "Completed", "Failed"),
      allowNull: false,
      defaultValue: "Pending",
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    deliveryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    confirmedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pinCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

// Correctly defined associations
Order.associate = (models) => {
  Order.belongsTo(models.User, { as: "buyer", foreignKey: "buyerId" });
  Order.hasMany(models.OrderItem, {
    foreignKey: "orderId",
    onDelete: "CASCADE",
  });
};

// Ensure this export exists:
module.exports = Order;
