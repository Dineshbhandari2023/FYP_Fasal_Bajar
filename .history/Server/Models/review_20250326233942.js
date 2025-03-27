const { DataTypes } = require("sequelize"); const sequelize = require("../config/dbConfig");

const Review = sequelize.define( "Review", 
    { rating: { type: DataTypes.FLOAT, allowNull: false, }, 
    comment: { type: DataTypes.TEXT, allowNull: true, },
     productId: { type: DataTypes.INTEGER, allowNull: false, 
        references: { model: "Products", key: "id", }, },
         orderId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "Orders", key: "id", }, }, userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id", }, }, }, { timestamps: true, } );

Review.associate = (models) => { Review.belongsTo(models.Product, { foreignKey: "productId" }); Review.belongsTo(models.User, { foreignKey: "userId" }); // Optionally associate with Order if needed: if (models.Order) { Review.belongsTo(models.Order, { foreignKey: "orderId" }); } };

module.exports = Review;