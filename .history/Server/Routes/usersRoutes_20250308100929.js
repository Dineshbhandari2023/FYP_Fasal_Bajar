const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
  logoutUser,
} = require("../Controllers/usersController");
const { authenticateToken } = require("../Util/auth");
const upload = require("../middlewares/multerConfig");

// When a user registers, use upload.single("image") middleware to handle the file upload.
// Here, "image" should match the name of the file field sent from the client.
router.post("/register", upload.single("image"), createUser);

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router
  .route("/user")
  .get(authenticateToken, getCurrentUser)
  .put(authenticateToken, updateUser);

module.exports = router;
