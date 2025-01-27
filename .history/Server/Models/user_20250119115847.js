const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema(
  {
    userFirstName: {
      type: String,
      required: true,
    },
    userLastName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
    userContactNumber: {
      type: Number,
      required: true,
    },
    userProfilePhoto: {
      type: String,
      required: true,
    },
    userOtp: {
      type: String,
    },
    isOTPVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userModel);

module.exports = User;
