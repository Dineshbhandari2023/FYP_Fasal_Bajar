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
    // Map "farmerId" in code to the "farmer_id" column in the database
    farmerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "farmer_id",
    },
    // Map "userId" in code to the "user_id" column in the database
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
  // Associate the review with the user who created it
  Review.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
  // If you need a separate association for the farmer being reviewed, you can uncomment:
  // Review.belongsTo(models.User, {
  //   foreignKey: "farmerId",
  //   as: "farmer",
  // });
};

module.exports = Review;
