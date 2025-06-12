// review.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

class Review extends Model {}

Review.init(
  {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    farmerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "farmer_id",
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "User", key: "id" },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "Reviews",
    timestamps: true,
  }
);

Review.associate = (models) => {
  Review.belongsTo(models.User, {
    foreignKey: "userId",
    as: "users",
  });
  // If you want an association for the farmer being reviewed, you can include it:
  Review.belongsTo(models.User, {
    foreignKey: "farmerId",
    as: "farmer",
  });
  Review.belongsTo(models.User, { as: "supplier", foreignKey: "supplierId" });
};

module.exports = Review;
