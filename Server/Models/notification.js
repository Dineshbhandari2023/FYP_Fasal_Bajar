const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Notification = sequelize.define(
  "Notification",
  {
    message: { type: DataTypes.STRING, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
  },
  { timestamps: true }
);

Notification.associate = (models) => {
  Notification.belongsTo(models.User, { foreignKey: "userId" });
};

module.exports = Notification;
