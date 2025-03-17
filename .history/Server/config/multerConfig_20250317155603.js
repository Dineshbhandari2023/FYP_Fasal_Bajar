// // multerConfig.js
// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// module.exports = multer({ storage: storage });

// multerConfig.js
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Destination storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/data/uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const fileExtension = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uniqueSuffix}${fileExtension}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
