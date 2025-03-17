const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); // Multer config for image uploads

// Import user controller functions
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
} = require("../controllers/userController");

// Import auth middleware to protect certain routes
const { protect } = require("../middleware/auth");

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
