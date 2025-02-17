const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Farmer = sequelize.define("Farmer", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  farmerName: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
});

Farmer.belongsTo(User, { foreignKey: "UserId" });
User.hasOne(Farmer, { foreignKey: "UserId" });

module.exports = Farmer;
