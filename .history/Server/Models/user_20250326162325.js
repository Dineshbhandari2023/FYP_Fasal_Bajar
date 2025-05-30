const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConfig");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    role: {
      type: DataTypes.ENUM("Farmer", "Buyer", "Supplier", "Admin"),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
        len: [10, 15],
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

// Model.prototype.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const DEFAULT_SALT_ROUNDS = 10;

User.addHook("beforeCreate", async (user) => {
  const encryptedPassword = await bcrypt.hash(
    user.password,
    DEFAULT_SALT_ROUNDS
  );
  user.password = encryptedPassword;
});

module.exports = User;
