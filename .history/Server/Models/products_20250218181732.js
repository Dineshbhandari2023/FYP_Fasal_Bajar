const { DataTypes, Model } = require("sequelize");
const sequelize = require("../Util/database");
module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      DataTypes: Sequelize.DATATYPES,
      tableName: "products",
    }
  );

  Product.associate = (models) => {
    // BelongsTo for User
    models.Product.belongsTo(models.User, { foreignKey: "userId" });

    // BelongsTo for Category
    models.Product.belongsTo(models.Category, { foreignKey: "categoryId" });

    // Has many for related products (optional)
    models.Product.hasMany(models.RelatedProduct, {
      foreignKey: "productId",
    });
  };

  return Product;
};
