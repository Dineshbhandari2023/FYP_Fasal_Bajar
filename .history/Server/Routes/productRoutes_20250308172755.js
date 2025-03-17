const express = require("express");
const router = express.Router();
const productController = require("../Controllers/productController");
const { authenticateToken } = require("../Util/auth");
const { isFarmer } = require("../Middlewares/authHandle");
const upload = require("../Middlewares/multerConfig");

// GET all products (public route)
router.get("/product", productController.getAllProducts);

// GET a single product by ID (public route)
router.get("/product/:id", productController.getProductById);

// CREATE a new product (protected & image upload)
router.post("/product", productController.createProduct);

// UPDATE a product by ID (protected & image upload)
router.put("/product/:id", productController.updateProduct);

// DELETE a product by ID (protected route)
router.delete(
  "/product/:id",
  authenticateToken,
  isFarmer,
  productController.deleteProduct
);

module.exports = router;
