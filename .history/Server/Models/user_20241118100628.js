const mongoose = require("mongoose");

const cors = require("cors");
// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    trim: true,
    required: true,
    max: 32,
  },
  email: {
    type: "string",
    trim: true,
    required: true,
    max: 32,
    unique: true,
  },
});
// Virtual fields

// methods
