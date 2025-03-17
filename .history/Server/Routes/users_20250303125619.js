const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
  logoutUser,
} = require("../Controllers/users");
const { verify } = require("../Util/jwt");

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user", verify, getCurrentUser);
router.put("/update", protect, updateUser);

module.exports = router;
