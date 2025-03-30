const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");

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
  getAllFarmers,
} = require("../Controllers/usersController");

// Import auth middleware to protect routes
const { authMiddleWare } = require("../Util/jwt");

// Public routes
router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);
router.get("/farmers", getAllFarmers);

// Protected routes (requires token)
router.get("/", authMiddleWare, getAllUsers);
router.get("/me", authMiddleWare, getCurrentUser);
router.get("/:id", authMiddleWare, getUserById);
router.put("/", authMiddleWare, upload.single("image"), updateUser);
router.post("/logout", authMiddleWare, handleLogout);

module.exports = router;
