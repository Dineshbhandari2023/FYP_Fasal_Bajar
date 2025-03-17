const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
  logoutUser,
} = require("../Controllers/usersController");
const { protect } = require("../Util/jwt");
// const { protect } = require("../Util/auth");

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
// router.get("/user", protect, getCurrentUser);
// router.put("/update", protect, updateUser);
router.route("/user").get(protect, getCurrentUser).put(protect, updateUser);

module.exports = router;
