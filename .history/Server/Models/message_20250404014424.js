const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Message = sequelize.define(
  "Message",
  {
    content: { type: DataTypes.TEXT, allowNull: false },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { timestamps: true }
);

Message.associate = (models) => {
  Message.belongsTo(models.User, { as: "sender", foreignKey: "senderId" });
  Message.belongsTo(models.User, { as: "receiver", foreignKey: "receiverId" });
};

module.exports = Message;
