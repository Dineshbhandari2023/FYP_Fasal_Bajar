const mongoose = require("mongoose");

const cors = require("cors");
// user schema
const userSchema = new Mongoose.Schema({
  name: {
    type: "string",
  },
});
// Virtual fields

// methods
