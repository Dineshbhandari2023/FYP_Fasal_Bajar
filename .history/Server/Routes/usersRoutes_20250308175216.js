const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
  logoutUser,
} = require("../Controllers/usersController");
const { authenticateToken } = require("../Middlewares/authHandle");
// const { protect } = require("../Util/auth");

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
// router.get("/user", protect, getCurrentUser);
// router.put("/update", protect, updateUser);
router
  .route("/user")
  .get(authenticateToken, getCurrentUser)
  .put(authenticateToken, updateUser);

module.exports = router;
