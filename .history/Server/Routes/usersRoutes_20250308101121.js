const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
  logoutUser,
} = require("../Controllers/usersController");
const { authenticateToken } = require("../Util/auth"); // Use the correct middleware name
const upload = require("../middlewares/multerConfig");

router.post("/register", upload.single("image"), createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router
  .route("/user")
  .get(authenticateToken, getCurrentUser)
  .put(authenticateToken, updateUser);

module.exports = router;
