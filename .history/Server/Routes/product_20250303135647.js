const express = require("express");
const router = express.Router();
const productController = require("../Controllers/productController");

// GET all products
router.get("/product", productController.getAllProducts);

// GET a single product by ID
router.get("/product/:id", productController.getSingleProduct);

// CREATE a new product
router.post("/product", productController.createProduct);

// UPDATE a product by ID
router.put("/product/:id", productController.updateProduct);

// DELETE a product by ID
router.delete("/product/:id", productController.deleteProduct);

module.exports = router;
