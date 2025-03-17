const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../Controllers/productController");
const { protect } = require("../Util/auth");
// const { authenticateToken } = require("../Util/auth");
// const { isFarmer } = require("../Middlewares/authHandle");
const multer = require("multer");
const upload = multer({ dest: "public/data/uploads/" });

// GET all products (public route)
router.get("/product", getAllProducts);

// GET a single product by ID (public route)
router.get("/product/:id", getProductById);

// CREATE a new product (protected & image upload)
// router.post("/product", createProduct);
router.post("/product", upload.array("images", 5), createProduct);

// UPDATE a product by ID (protected & image upload)
router.put("/product/:id", protect, updateProduct);

// DELETE a product by ID (protected route)
router.delete("/product/:id", protect, deleteProduct);

module.exports = router;
