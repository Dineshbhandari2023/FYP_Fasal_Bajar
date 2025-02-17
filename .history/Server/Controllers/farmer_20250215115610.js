const Farmer = require("../models/farmer");
const Product = require("../models/product");

exports.getProductsByFarmer = async function (req, res, next) {
  try {
    const farmerId = req.user.id;
    const products = await Product.findAll({ where: { farmerId } });
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async function (req, res, next) {
  try {
    const farmerId = req.user.id;
    const { name, description, price, location } = req.body;

    if (!name || !description || !price || !location) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (price < 0) {
      return res.status(400).json({ error: "Price must be greater than 0" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      location,
      farmerId,
    });

    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async function (req, res, next) {
  try {
    const farmerId = req.user.id;
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updateData = {
      ...req.body,
    };

    // Update only the fields that are provided in the request
    const updatedProduct = await product.update(updateData, {
      returning: true,
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async function (req, res, next) {
  try {
    const farmerId = req.user.id;
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Soft delete or permanent delete? You might want to add a soft delete feature
    const deletedProduct = await product.destroy();

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
