const mongoose = require("mongoose");

const cors = require("cors");
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
  password: {
    type: String,
    trim: true,
    required: true,
    max: 32,
  },
});
// Virtual fields

// methods
