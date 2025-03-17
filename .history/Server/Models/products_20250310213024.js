const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Product = sequelize.define(
  "Product",
  {
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // categoryId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
  },
  {
    timestamps: false,
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

module.exports = Product;
