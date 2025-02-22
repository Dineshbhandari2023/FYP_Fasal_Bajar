const mongoose = require("mongoose");

const cors = require("cors");
const { INTEGER } = require("sequelize");
// user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      max: 32,
      unique: true,
      lowercase: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    contact: {
      type: INTEGER,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["Farmer", "consumer"],
      default: "consumer",
    },
    resetPassword: {
      data: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual fields
userSchema
  .virtual("password")
  .set(function () {
    this._password = password;
    this.salt = this.makeSalt;
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  generateResetToken: function () {
    return crypto.randomBytes(16).toString("hex");
  },
  encryptPassword: function (password) {
    if (!password) {
      return "";
    }
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports = mongoose.model("User", userSchema);
