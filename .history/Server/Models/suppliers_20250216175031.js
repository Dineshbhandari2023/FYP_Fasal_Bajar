const { DataTypes } = require("sequelize");
const sequelize = require("../Util/database");
const User = require("./user");

const Supplier = sequelize.define("Supplier", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  companyName: { type: DataTypes.STRING, allowNull: false },
  contactInfo: { type: DataTypes.STRING, allowNull: false },
});

Supplier.belongsTo(User, { foreignKey: "UserId" });
User.hasOne(Supplier, { foreignKey: "UserId" });

module.exports = Supplier;
