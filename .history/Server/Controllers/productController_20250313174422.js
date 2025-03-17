// const createError = require("http-errors");
// const { Product } = require("../Models/products");
// const cloudinary = require("cloudinary").v2;
// const { uploadToCloudinary, getFilePath } = require("../Util/uploadFile");

// const createProduct = async (req, res, next) => {
//   try {
//     const { productName, productType, quantity, price, location, categoryId } =
//       req.body;

//     // Validate mandatory fields...
//     if (
//       !productName ||
//       !productType ||
//       !quantity ||
//       !price ||
//       !location
//       // !categoryId
//     ) {
//       return next(createError(400, "All fields are required."));
//     }

//     // Optional: userId from your token-based auth
//     const userId = req.user && (req.user.id || req.user.sub);
//     if (!userId) {
//       return next(createError(401, "User not authenticated"));
//     }

//     // If there's a file, upload it
//     let imageUrl = "";
//     if (req.file) {
//       const imagePath = getFilePath(req.file.filename); // local path
//       const imageMimeType = req.file.mimetype.split("/").pop();
//       imageUrl = await uploadToCloudinary(
//         imagePath,
//         "products-images", // your folder name in Cloudinary
//         req.file.filename,
//         imageMimeType
//       );
//     }

//     // Create product in DB
//     const newProduct = await Product.create({
//       productName,
//       productType,
//       quantity,
//       price,
//       location,
//       // categoryId,
//       userId, // the user who created it
//       image: imageUrl,
//     });

//     res.status(201).json({
//       StatusCode: 201,
//       IsSuccess: true,
//       ErrorMessage: [],
//       Result: {
//         message: "Product created successfully",
//         productData: newProduct,
//       },
//     });
//   } catch (error) {
//     next(
//       createError(500, `Server error while creating product: ${error.message}`)
//     );
//   }
// };

// const getAllProducts = async (req, res, next) => {
//   try {
//     const products = await Product.findAll();

//     res.status(200).json({
//       StatusCode: 200,
//       IsSuccess: true,
//       ErrorMessage: [],
//       Result: {
//         productData: products,
//       },
//     });
//   } catch (error) {
//     next(
//       createError(500, `Server error while fetching products: ${error.message}`)
//     );
//   }
// };

// const getProductById = async (req, res, next) => {
//   const { id } = req.params;

//   try {
//     const product = await Product.findByPk(id);
//     if (!product) {
//       return next(createError(404, "Product not found"));
//     }

//     res.status(200).json({
//       StatusCode: 200,
//       IsSuccess: true,
//       ErrorMessage: [],
//       Result: { productData: product },
//     });
//   } catch (error) {
//     next(
//       createError(
//         500,
//         `Server error while retrieving product: ${error.message}`
//       )
//     );
//   }
// };

// const updateProduct = async (req, res, next) => {
//   const { id } = req.params;
//   const { productName, productType, quantity, price, location } = req.body;

//   try {
//     const product = await Product.findByPk(id);
//     if (!product) {
//       return next(createError(404, "Product not found"));
//     }

//     let imageUrl = product.image;
//     if (req.file) {
//       if (imageUrl) {
//         const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
//         await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
//       }
//       const imagePath = getFilePath(req.file.filename);
//       const imageMimeType = req.file.mimetype.split("/").pop();
//       imageUrl = await uploadToCloudinary(
//         imagePath,
//         "products-images",
//         req.file.filename,
//         imageMimeType
//       );
//     }

//     await product.update({
//       productName,
//       productType,
//       quantity,
//       price,
//       location,
//       image: imageUrl,
//     });

//     res.status(200).json({
//       StatusCode: 200,
//       IsSuccess: true,
//       ErrorMessage: [],
//       Result: {
//         message: "Product updated successfully",
//         productData: product,
//       },
//     });
//   } catch (error) {
//     next(
//       createError(500, `Server error while updating product: ${error.message}`)
//     );
//   }
// };

// const deleteProduct = async (req, res, next) => {
//   const { id } = req.params;

//   try {
//     const product = await Product.findByPk(id);
//     if (!product) {
//       return next(createError(404, "Product not found"));
//     }

//     const imageUrl = product.image;
//     if (imageUrl) {
//       const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
//       await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
//     }

//     await product.destroy();

//     res.status(200).json({
//       StatusCode: 200,
//       IsSuccess: true,
//       ErrorMessage: [],
//       Result: { message: "Product deleted successfully" },
//     });
//   } catch (error) {
//     next(
//       createError(500, `Server error while deleting product: ${error.message}`)
//     );
//   }
// };

// module.exports = {
//   createProduct,
//   getAllProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// };

const createError = require("http-errors");
const Product = require("../Models/products");
// const cloudinary = require("cloudinary").v2;
// const { uploadToCloudinary, getFilePath } = require("../Util/uploadFile");

const createProduct = async (req, res, next) => {
  try {
    const { productName, productType, quantity, price, location } = req.body;

    // Validate mandatory fields
    if (!productName || !productType || !quantity || !price || !location) {
      return next(createError(400, "All fields are required."));
    }

    // Get userId from your token-based authentication
    const userId = req.user && (req.user.id || req.user.sub);
    if (!userId) {
      return next(createError(401, "User not authenticated"));
    }

    // If a file was uploaded, store its path
    let imageUrl = "";
    if (req.file) {
      imageUrl = req.file.path;
    }

    // Create product in the database
    const newProduct = await Product.create({
      productName,
      productType,
      quantity,
      price,
      location,
      userId, // The user who created it
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

    // Retain the current image path; if a new file is uploaded, update it
    let imageUrl = product.image;
    if (req.file) {
      imageUrl = req.file.path;
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

const getMyProducts = async (req, res) => {
  try {
    // req.user should be populated by authMiddleWare with user info
    const userId = req.user.id;
    const products = await Product.find({ createdBy: userId });

    return res.status(200).json({
      Success: true,
      Result: {
        productData: products,
      },
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
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
