const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
  logoutUser,
} = require("../Controllers/users");
// const { verify } = require("../Util/jwt");
const { protect } = require("../Middlewares/auth");

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user", getCurrentUser);
router.put("/update", updateUser);

module.exports = router;
