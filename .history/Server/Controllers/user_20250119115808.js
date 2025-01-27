const mongoose = require("mongoose");

const User = require("../model/user_model");

const errorMessage = {
  status: "Error",
  message: "Error message here",
  data: null,
};

const successMessage = {
  status: "Success",
  message: "Success message here",
  data: null,
};

// fetching all users
exports.getAllUser = async (req, res) => {
  const users = (await User.find()).filter((user) => user.role !== "Admin");

  if (users.length === 0) {
    return res.status(400).json({
      ...errorMessage,
      message: "No any users found.",
    });
  }

  return res.status(200).json({
    ...successMessage,
    message: "Users fetched successfully.",
    users,
  });
};

// fetching single user
exports.getSingleUser = async (req, res) => {
  const id = req.params.id;

  const validId = mongoose.Types.ObjectId.isValid(id);

  if (!validId) {
    return res.status(400).json({
      ...errorMessage,
      message: "Invalid Id provided",
    });
  }

  const userExist = await User.findById(id);

  if (!userExist) {
    return res.status(400).json({
      ...errorMessage,
      message: "user with this ID doesn't exist.",
    });
  }

  res.status(200).json({
    ...successMessage,
    messsage: "User fetched successfully.",
    data: userExist,
  });
};

// updating User
exports.updateUser = async (req, res) => {};
