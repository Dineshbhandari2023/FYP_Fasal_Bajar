const createError = require("http-errors");
const Product = require("../Models/products");

const createProduct = async (req, res, next) => {
  try {
    const { productName, productType, quantity, price, location } = req.body;
    if (!productName || !productType || !quantity || !price || !location) {
      return next(createError(400, "All fields are required."));
    }

    const userId = req.user && (req.user.id || req.user.sub);
    if (!userId) {
      return next(createError(401, "User not authenticated"));
    }
 
    let imageUrl = "";
    if (req.file) {
      imageUrl = `uploads/${req.file.filename}`;
    }

    const newProduct = await Product.create({
      productName,
      productType,
      quantity,
      price,
      location,
      userId, 
      image: imageUrl,
    });

    res.status(201).json({
      StatusCode: 201,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Product created successfully",
        productData: newProduct,
      },
    });
  } catch (error) {
    next(
      createError(500, `Server error while creating product: ${error.message}`)
    );
  }
};

// Get all products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: { productData: products },
    });
  } catch (error) {
    next(
      createError(500, `Server error while fetching products: ${error.message}`)
    );
  }
};

// Get a single product by ID
const getProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return next(createError(404, "Product not found"));
    }
    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: { productData: product },
    });
  } catch (error) {
    next(
      createError(
        500,
        `Server error while retrieving product: ${error.message}`
      )
    );
  }
};

// Update a product (if a new image is uploaded, update the stored file path)
const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { productName, productType, quantity, price, location } = req.body;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return next(createError(404, "Product not found"));
    }
    
    let imageUrl = product.image;
    if (req.file) {
      imageUrl = `uploads/${req.file.filename}`;
    }

    await product.update({
      productName,
      productType,
      quantity,
      price,
      location,
      image: imageUrl,
    });

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Product updated successfully",
        productData: product,
      },
    });
  } catch (error) {
    next(
      createError(500, `Server error while updating product: ${error.message}`)
    );
  }
};

// Delete a product
const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return next(createError(404, "Product not found"));
    }
    await product.destroy();

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: { message: "Product deleted successfully" },
    });
  } catch (error) {
    next(
      createError(500, `Server error while deleting product: ${error.message}`)
    );
  }
};

const getMyProducts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const products = await Product.findAll({ where: { userId } });
    return res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: { productData: products },
    });
  } catch (error) {
    return res.status(500).json({
      StatusCode: 500,
      IsSuccess: false,
      ErrorMessage: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
};
