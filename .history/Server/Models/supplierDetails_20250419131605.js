const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const SupplierDetails = sequelize.define(
  "SupplierDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      unique: true,
    },
    vehicleType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleRegistration: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    vehicleCapacity: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: "Capacity in kilograms",
    },
    serviceArea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    licenseDocument: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active",
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    totalDeliveries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    currentLocation: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "JSON object with latitude and longitude",
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  }
);

SupplierDetails.associate = (models) => {
  SupplierDetails.belongsTo(models.User, { foreignKey: "userId" });
};

module.exports = SupplierDetails;
