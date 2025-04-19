const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Delivery = sequelize.define(
  "Delivery",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    deliveryNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    orderItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "OrderItems",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(
        "Assigned",
        "Pickup_In_Progress",
        "Picked_Up",
        "In_Transit",
        "Delivered",
        "Failed",
        "Cancelled"
      ),
      defaultValue: "Assigned",
    },
    pickupLocation: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "JSON object with address and coordinates",
    },
    deliveryLocation: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "JSON object with address and coordinates",
    },
    assignedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    pickedUpAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estimatedPickupTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estimatedDeliveryTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "Distance in kilometers",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Path to delivery confirmation signature image",
    },
    proofOfDelivery: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Path to proof of delivery image",
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Delivery.associate = (models) => {
  Delivery.belongsTo(models.User, { as: "supplier", foreignKey: "supplierId" });
  Delivery.belongsTo(models.OrderItem, { foreignKey: "orderItemId" });
};

module.exports = Delivery;
