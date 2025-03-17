const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
  logoutUser,
} = require("../Controllers/users");
const { protect } = require("../Middlewares/auth");

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user", protect, getCurrentUser);
router.put("/updateuser", protect, updateUser);

module.exports = router;
