const mongoose = require("mongoose");

const cors = require("cors");
const { INTEGER } = require("sequelize");
// user schema
const userSchema = new mongoose.Schema({
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
  contact: {
    type: INTEGER,
    trim: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["Farmer", "consumer"],
  },
});
// Virtual fields

// methods
