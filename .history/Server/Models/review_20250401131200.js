// Models/review.js
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
    // Maps "farmerId" in code to the "farmer_id" column in the database
    farmerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "farmer_id",
    },
    // Maps "userId" in code to the "user_id" column in the database
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
    as: "farmers",
  });
};

module.exports = Review;
