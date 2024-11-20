const mongoose = require("mongoose");

const cors = require("cors");
// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    trim: true,
    required: true,
  },
});
// Virtual fields

// methods
