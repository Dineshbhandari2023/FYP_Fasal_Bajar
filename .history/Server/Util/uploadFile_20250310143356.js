// const path = require("path");
// const fs = require("fs").promises;
// const cloudinary = require("../config/config");

// const uploadToCloudinary = async (filePath, folder, filename, format) => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder,
//       public_id: filename,
//       resource_type: format === "pdf" ? "raw" : "image",
//     });
//     await fs.unlink(filePath);
//     return result.secure_url;
//   } catch (error) {
//     await fs.unlink(filePath);
//     throw error;
//   }
// };

// const getFilePath = (filename) => {
//   return path.resolve(__dirname, "../../public/data/uploads", filename);
// };

// module.exports = { uploadToCloudinary, getFilePath };

// utils/uploadFile.js
const path = require("path");
const fs = require("fs").promises;
const cloudinary = require("cloudinary").v2; // Proper import

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Full path to local file
 * @param {string} folder - Name of the folder in Cloudinary
 * @param {string} filename - Desired public ID or name
 * @param {string} format - The file extension (e.g., 'jpg', 'png', 'pdf')
 * @returns {Promise<string>} Secure URL of the uploaded file
 */
const uploadToCloudinary = async (filePath, folder, filename, format) => {
  try {
    // Decide resource type based on extension
    const resourceType = format === "pdf" ? "raw" : "image";

    // Upload file
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: filename,
      resource_type: resourceType,
      // optional: overwrite: true, if you want to overwrite existing files
      // optional: use_filename: true, if you want to use the original filename
    });

    // Remove local file after successful upload
    await fs.unlink(filePath);

    // Return the secure URL
    return result.secure_url;
  } catch (error) {
    // Clean up local file if upload fails
    await fs.unlink(filePath).catch(() => {});
    throw error;
  }
};

/**
 * Get the absolute file path from filename in your `public/data/uploads` directory
 * @param {string} filename
 */
const getFilePath = (filename) => {
  return path.resolve(__dirname, "../../public/data/uploads", filename);
};

module.exports = { uploadToCloudinary, getFilePath };
