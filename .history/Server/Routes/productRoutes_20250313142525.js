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
const { authMiddleWare } = require("../Util/jwt");

// Create product route with image upload support
router.post("/", authMiddleWare, upload.single("image"), createProduct);

// Get all products (public endpoint)
router.get("/", getAllProducts);

// Get product by ID (public endpoint)
router.get("/:id", getProductById);

// Update product (protected route with optional image update)
router.put("/:id", authMiddleWare, upload.single("image"), updateProduct);

// Delete product (protected route)
router.delete("/:id", authMiddleWare, deleteProduct);

module.exports = router;
