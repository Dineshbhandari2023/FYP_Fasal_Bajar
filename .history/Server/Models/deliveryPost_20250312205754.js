// models/deliveryPost.js

module.exports = (sequelize, DataTypes) => {
  const DeliveryPost = sequelize.define(
    "DeliveryPost",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      model: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      capacity: {
        type: DataTypes.INTEGER, // Sequelize prefers INTEGER over NUMBER
        allowNull: false,
      },

      vehicleImage: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      district: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      company: {
        type: DataTypes.STRING,
        allowNull: true, // was require: false in mongoose
      },

      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      land: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "delivery_posts", // explicit table name; optional
      timestamps: true,
    }
  );

  return DeliveryPost;
};
