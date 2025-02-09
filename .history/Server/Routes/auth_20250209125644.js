const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");
const { protect } = require("../Middlewares/auth");

router.post("/register", createUser);
router.post("/login", loginUser);

router.route("/user").get(protect, getCurrentUser).put(protect, updateUser);

module.exports = router;
