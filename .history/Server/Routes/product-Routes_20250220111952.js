module.exports = function (app, Sequelize) {
  const productController = require("../Controllers/productController");

  // GET all products
  app.get("/products", (req, res, next) => {
    productController.getAllProducts(req, res, next);
  });

  // GET single product by ID
  app.get("/products/:id", (req, res, next) => {
    productController.getSingleProduct(req, res, next, req.params.id);
  });

  // POST to create new product
  app.post("/products", (req, res, next) => {
    productController.createProduct(req, res, next);
  });

  // PUT to update existing product
  app.put("/products/:id", (req, res, next) => {
    productController.updateProduct(req, res, next, req.params.id);
  });

  // DELETE product by ID
  app.delete("/products/:id", (req, res, next) => {
    productController.deleteProduct(req, res, next, req.params.id);
  });
};
