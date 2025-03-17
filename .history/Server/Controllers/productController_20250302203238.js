const Product = require("../Models/products");

module.exports = {
  // GET all products
  getAllProducts: async (req, res, next) => {
    try {
      const products = await Product.findAll({
        order: [["productName", "ASC"]], // Note the correct array syntax
      });

      if (!products || products.length === 0) {
        return res.status(404).json({ error: "No products found" });
      }

      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  },

  // GET single product by ID
  getSingleProduct: async (req, res, next, id) => {
    try {
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  },

  // CREATE new product
  createProduct: async (req, res, next) => {
    try {
      const {
        productName,
        productType,
        quantity,
        price,
        location,
        categoryId,
      } = req.body;

      const userId = req.user ? req.user.id : req.body.userId;

      const newProduct = await Product.create({
        productName,
        productType,
        quantity,
        price,
        location,
        userId,
        categoryId,
      });

      if (!newProduct) {
        return res.status(400).json({ error: "Failed to create product" });
      }

      res.status(201).json(newProduct);
    } catch (err) {
      next(err);
    }
  },

  // UPDATE product by ID
  updateProduct: async (req, res, next, id) => {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Update fields based on the request body
      // This updates only the fields provided in req.body
      await product.update(req.body);

      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  },

  // DELETE product by ID
  deleteProduct: async (req, res, next, id) => {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      await product.destroy();
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
};
