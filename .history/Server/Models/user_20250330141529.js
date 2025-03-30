const { DataTypes } = require("sequelize");
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
      type: DataTypes.ENUM("Farmer", "Buyer"),
      allowNull: false,
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
    // Additional fields for password reset functionality:
    lastPasswordResetRequest: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    resetPasswordCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordCodeExpires: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    // Updated column for profile image as LONGBLOB
    profileImage: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
  },
  { timestamps: false }
);

// Instance method to match passwords
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
