// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/dbConfig");

// const Product = sequelize.define(
//   "Product",
//   {
//     productName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     productType: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     quantity: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     price: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     image: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     location: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     // categoryId: {
//     //   type: DataTypes.INTEGER,
//     //   allowNull: false,
//     // },
//   },
//   {
//     timestamps: false,
//   }
// );

// Product.associate = (models) => {
//   // BelongsTo for User
//   models.Product.belongsTo(models.User, { foreignKey: "userId" });

//   // BelongsTo for Category
//   models.Product.belongsTo(models.Category, { foreignKey: "categoryId" });

//   // Has many for related products (optional)
//   models.Product.hasMany(models.RelatedProduct, {
//     foreignKey: "productId",
//   });
// };

// module.exports = Product;

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
    // URL of the image stored in Cloudinary
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Cloudinary public ID for the image (to facilitate image deletion/updating)
    imagePublicId: {
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
    // Re-enabled categoryId to maintain association with Category
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
  // Association with User
  models.Product.belongsTo(models.User, { foreignKey: "userId" });
  // Association with Category
  models.Product.belongsTo(models.Category, { foreignKey: "categoryId" });
  // Association with RelatedProduct (if needed)
  models.Product.hasMany(models.RelatedProduct, { foreignKey: "productId" });
};

module.exports = Product;
