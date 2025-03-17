const { DataTypes } = require("sequelize");
const sequelize = require("../Util/dbConfig");
const User = require("./user");

const Buyer = sequelize.define("Buyer", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  businessName: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
});

Buyer.belongsTo(User, { foreignKey: "UserId" });
User.hasOne(Buyer, { foreignKey: "UserId" });

module.exports = Buyer;
