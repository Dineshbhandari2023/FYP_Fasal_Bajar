const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require("../Controllers/productController");


const { authMiddleWare } = require("../Util/jwt");
router.post("/", authMiddleWare, upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/myproducts", authMiddleWare, getMyProducts);
router.get("/:id", getProductById);
router.put("/:id", authMiddleWare, upload.single("image"), updateProduct);
router.delete("/:id", authMiddleWare, deleteProduct);

module.exports = router;
