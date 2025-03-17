const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

// Define OrderItem model for the items in each order
const OrderItem = sequelize.define(
  "OrderItem",
  {
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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
    },
    farmerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    // New fields for farmer acceptance/rejection
    status: {
      type: DataTypes.ENUM("Pending", "Accepted", "Declined"),
      allowNull: false,
      defaultValue: "Pending",
    },
    statusUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    farmerNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

OrderItem.associate = (models) => {
  // An order item belongs to an order
  models.OrderItem.belongsTo(models.Order, {
    foreignKey: "orderId",
  });

  // An order item belongs to a product
  models.OrderItem.belongsTo(models.Product, {
    foreignKey: "productId",
  });

  // An order item belongs to a farmer (the seller)
  models.OrderItem.belongsTo(models.User, {
    as: "farmer",
    foreignKey: "farmerId",
  });
};

module.exports = OrderItem;
