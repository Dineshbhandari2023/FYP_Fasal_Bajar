const createError = require("http-errors");
const { Product } = require("../models");
const cloudinary = require("cloudinary").v2;
const { uploadToCloudinary, getFilePath } = require("../utils/fileUpload");

const createProduct = async (req, res, next) => {
  const { productName, productType, quantity, price, location, categoryId } =
    req.body;

  if (
    !productName ||
    !productType ||
    !quantity ||
    !price ||
    !location ||
    !categoryId
  ) {
    return next(createError(400, "All fields are required."));
  }

  try {
    const userId = req.user.id; // Assuming user is authenticated

    let imageUrl = "";
    if (req.file) {
      const imagePath = getFilePath(req.file.filename);
      const imageMimeType = req.file.mimetype.split("/").pop();
      imageUrl = await uploadToCloudinary(
        imagePath,
        "products-images",
        req.file.filename,
        imageMimeType
      );
    }

    const newProduct = await Product.create({
      productName,
      productType,
      quantity,
      price,
      location,
      categoryId,
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

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        productData: products,
      },
    });
  } catch (error) {
    next(
      createError(500, `Server error while fetching products: ${error.message}`)
    );
  }
};

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

const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { productName, productType, quantity, price, location, categoryId } =
    req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    let imageUrl = product.image;
    if (req.file) {
      if (imageUrl) {
        const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      }
      const imagePath = getFilePath(req.file.filename);
      const imageMimeType = req.file.mimetype.split("/").pop();
      imageUrl = await uploadToCloudinary(
        imagePath,
        "products-images",
        req.file.filename,
        imageMimeType
      );
    }

    await product.update({
      productName,
      productType,
      quantity,
      price,
      location,
      categoryId,
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

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    const imageUrl = product.image;
    if (imageUrl) {
      const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
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

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
