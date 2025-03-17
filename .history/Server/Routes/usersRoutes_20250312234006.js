const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");

// Import user controller functions from the correct path (adjust folder name if needed)
const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  getAllUsers,
  getUserById,
  handleLogout,
  getCurrentUser,
  updateUser,
} = require("../Controllers/usersController");

// Import auth middleware to protect certain routes
const { protect } = require("../Util/auth");

// Public routes
router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

// Protected routes (requires token)
router.get("/", protect, getAllUsers);
router.get("/me", protect, getCurrentUser);
router.get("/:id", protect, getUserById);
router.put("/", protect, updateUser);
router.post("/logout", protect, handleLogout);

module.exports = router;
