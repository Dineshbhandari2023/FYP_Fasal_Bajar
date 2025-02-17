module.exports = function (sequelize, Sequelize) {
  const Product = sequelize.define("product", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: { len: 5 },
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate: { min: 0, max: 100 },
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    farmerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Product;
};
