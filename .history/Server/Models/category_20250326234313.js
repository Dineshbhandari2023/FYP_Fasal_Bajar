const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Category = sequelize.define(
  "Category",
  {
    categoryName: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  { timestamps: true }
);

Category.associate = (models) => {
  Category.hasMany(models.Product, { foreignKey: "categoryId" });
};

module.exports = Category;
