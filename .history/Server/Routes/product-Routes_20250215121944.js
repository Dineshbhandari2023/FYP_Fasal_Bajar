const farmerRouter = require("express").Router();
const {
  getProductsByFarmer,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/farmers");

farmerRouter.get("/products", getProductsByFarmer);
farmerRouter.post("/products", createProduct);
farmerRouter.put("/products/:productId", updateProduct);
farmerRouter.delete("/products/:productId", deleteProduct);

module.exports = farmerRouter;
