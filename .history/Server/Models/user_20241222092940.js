// const mongoose = require("mongoose");

// const cors = require("cors");
// const { INTEGER } = require("sequelize");
// // user schema
// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       trim: true,
//       required: true,
//       max: 32,
//     },
//     email: {
//       type: String,
//       trim: true,
//       required: true,
//       max: 32,
//       unique: true,
//       lowercase: true,
//     },
//     hashed_password: {
//       type: String,
//       required: true,
//     },
//     salt: {
//       type: String,
//     },
//     contact: {
//       type: INTEGER,
//       trim: true,
//       required: true,
//     },
//     role: {
//       type: String,
//       enum: ["Farmer", "consumer"],
//       default: "consumer",
//     },
//     resetPassword: {
//       data: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Virtual fields
// userSchema
//   .virtual("password")
//   .set(function () {
//     this._password = password;
//     this.salt = this.makeSalt;
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function () {
//     return this._password;
//   });

// // methods
// userSchema.methods = {
//   authenticate: function (plainText) {
//     return this.encryptPassword(plainText) === this.hashed_password;
//   },

//   generateResetToken: function () {
//     return crypto.randomBytes(16).toString("hex");
//   },
//   encryptPassword: function (password) {
//     if (!password) {
//       return "";
//     }
//     try {
//       return crypto
//         .createHmac("sha1", this.salt)
//         .update(password)
//         .digest("hex");
//     } catch (err) {
//       return "";
//     }
//   },
//   makeSalt: function () {
//     return Math.round(new Date().valueOf() * Math.random()) + "";
//   },
// };

// module.exports = mongoose.model("User", userSchema);

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Import Sequelize instance

module.exports = (sequelize, DataTypes) => {
  User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("Farmer", "Buyer", "Supplier"),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
};
