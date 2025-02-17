const { sequelize } = require("../Util/database");
const Product = require("../Models/Product");

module.exports = {
  getAllProducts: (req, res, next) => {
    Product.findAll({
      order: ["productName", "asc"],
      where: {},
    })
      .then((products) => {
        if (!products.length)
          return res.status(404).json({ error: "No products found" });
        res.json(products);
      })
      .catch((err) => next(err));
  },

  getSingleProduct: (req, res, next, id) => {
    Product.findById(id)
      .then((product) => {
        if (!product)
          return res.status(404).json({ error: "Product not found" });
        res.json(product);
      })
      .catch((err) => next(err));
  },

  createProduct: async (req, res, next) => {
    try {
      const newProduct = await Product.create({
        productName: req.body.productName,
        productType: req.body.productType,
        quantity: req.body.quantity,
        price: req.body.price,
        location: req.body.location,
        userId: req.user.id,
      });

      if (newProduct) {
        res.status(201).json(newProduct);
      } else {
        res.status(400).json({ error: "Failed to create product" });
      }
    } catch (err) {
      next(err);
    }
  },

  updateProduct: async (req, res, next, id) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(400).json({ error: "Failed to update product" });
      }
    } catch (err) {
      next(err);
    }
  },

  deleteProduct: async (req, res, next, id) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (deletedProduct) {
        res.status(200).json({ message: "Product deleted successfully" });
      } else {
        res.status(400).json({ error: "Failed to delete product" });
      }
    } catch (err) {
      next(err);
    }
  },
};
