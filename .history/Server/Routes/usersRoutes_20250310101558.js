// const express = require("express");
// const router = express.Router();
// const {
//   createUser,
//   loginUser,
//   getCurrentUser,
//   updateUser,
// } = require("../Controllers/usersController");
// const { protect } = require("../Util/auth");

// router.post("/register", createUser);
// router.post("/login", loginUser);

// router.route("/user").get(protect, getCurrentUser).put(protect, updateUser);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  refreshAccessToken,
  getAllUsers,
  getUserById,
  handleLogout,
} = require("../Controllers/usersController");

const { protect } = require("../Util/auth");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshAccessToken);

// Protected Routes
router.get("/users", protect, getAllUsers);
router.get("/users/:id", protect, getUserById);
router.post("/logout", protect, handleLogout);

module.exports = router;
