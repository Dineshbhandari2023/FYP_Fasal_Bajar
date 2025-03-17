const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); // Multer config for image uploads

// Import product controller functions
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../Controllers/productController");

// Import auth middleware to protect routes that require authentication
const { protect } = require("../Util/auth");

// Create product route with image upload support
router.post("/", protect, upload.single("image"), createProduct);

// Get all products (public endpoint)
router.get("/", getAllProducts);

// Get product by ID (public endpoint)
router.get("/:id", getProductById);

// Update product (protected route with optional image update)
router.put("/:id", protect, upload.single("image"), updateProduct);

// Delete product (protected route)
router.delete("/:id", protect, deleteProduct);

module.exports = router;
