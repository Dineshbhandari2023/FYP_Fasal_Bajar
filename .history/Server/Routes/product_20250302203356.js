const express = require("express");
const router = express.Router();
const productController = require("../Controllers/productController");

// GET all products
router.get("/", productController.getAllProducts);

// GET a single product by ID
router.get("/:id", productController.getSingleProduct);

// CREATE a new product
router.post("/", productController.createProduct);

// UPDATE a product by ID
router.put("/:id", productController.updateProduct);

// DELETE a product by ID
router.delete("/:id", productController.deleteProduct);

module.exports = router;
