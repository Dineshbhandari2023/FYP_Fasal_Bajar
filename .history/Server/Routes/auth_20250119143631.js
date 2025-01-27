const router = require("express").Router();
const multer = require("multer");

const catchAsync = require("../middleware/catch_async");

const storage = require("../services/multer_config");
const upload = multer({ storage: storage });

const {
  userSignUpOtp,
  userSignUp,
  userLogin,
  forgotOtp,
  forgotPassword,
  verifyOtp,
} = require("../controller/auth_controller");

// auth
router.route("/signup/otp").post(catchAsync(userSignUpOtp));
router
  .route("/signup")
  .post(upload.single("userProfilePhoto"), catchAsync(userSignUp));
router.route("/login").post(catchAsync(userLogin));
router.route("/forgot/otp").post(catchAsync(forgotOtp));
router.route("/verify/otp").post(catchAsync(verifyOtp));
router.route("/forgot/password").post(catchAsync(forgotPassword));

module.exports = router;
