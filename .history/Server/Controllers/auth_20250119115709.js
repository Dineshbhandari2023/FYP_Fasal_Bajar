const mongoose = require("mongoose");
const User = require("../model/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const otpGenerator = require("otp-generator");
const sendSms = require("../services/send_SMS");
const sendMail = require("../services/send_mail");

let signUpOtp;

const errorMessage = {
  status: "Error",
  message: "Error message here",
  data: null,
};

const successMessage = {
  status: "Success",
  message: "Success message here",
  data: null,
};

// sendOtp
exports.userSignUpOtp = async (req, res) => {
  const { userContactNumber } = req.body;

  if (!userContactNumber) {
    return res.status(400).json({
      ...errorMessage,
      message: "Please enter a valid contact number.",
    });
  }

  signUpOtp = otpGenerator.generate(6, {
    lowerCaseAlphabets: true,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  console.log(signUpOtp);

  await sendSms(userContactNumber, signUpOtp);

  res.status(200).json({
    ...successMessage,
    message: "Otp Sent Successfully.",
  });
};

// user Signup
exports.userSignUp = async (req, res) => {
  const {
    userFirstName,
    userLastName,
    userEmail,
    userPassword,
    userContactNumber,
    userOtp,
  } = req.body;

  const userProfilePhoto = req.file;

  console.log(userProfilePhoto);

  const userExist = await User.find({
    userEmail,
  });

  if (userExist.length > 0) {
    return res.status(400).json({
      status: "Error",
      message: "User with this Email or contact already exist.",
      data: null,
    });
  }

  if (signUpOtp !== userOtp) {
    return res.status(400).json({
      status: "Error",
      message: "Please check and enter the correct OTP.",
      data: null,
    });
  }

  const newUser = await User.create({
    userFirstName,
    userLastName,
    userEmail,
    userPassword,
    userContactNumber,
    userProfilePhoto: `${Date.now()}--}`,
  });

  res.status(200).json({
    status: "Success",
    message: `User named as ${userFirstName} Created Successfully.`,
    data: newUser,
  });
};

// userLogin
exports.userLogin = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  if (!userEmail || !userPassword) {
    return res.status(400).json({
      ...errorMessage,
      message: "please provide all the data.",
    });
  }

  const userExist = await User.findOne({ userEmail });

  if (!userExist) {
    return res.status(400).json({
      ...errorMessage,
      message: "user with this Email doesn't exist.",
    });
  }

  const passwordMatched = bcrypt.compareSync(
    userPassword,
    userExist.userPassword
  );

  if (!passwordMatched) {
    return res.status(400).json({
      ...errorMessage,
      message: "user Email or password doesn't matched.",
    });
  }

  const jwtToken = jwt.sign(
    {
      id: userExist._id,
    },
    JSON_SECRET_KEY,
    {
      expiresIn: "10m",
    }
  );

  res.status(200).json({
    ...successMessage,
    message: "Logged in successfully.",
    data: jwtToken,
  });
};

// send otp -- forgot password
exports.forgotOtp = async (req, res) => {
  const { forgotEmail } = req.body;

  if (!forgotEmail) {
    return res.status(400).json({
      ...errorMessage,
      message: "Please enter all the data",
    });
  }

  const userExist = await User.findOne({ userEmail: forgotEmail });

  if (!userExist) {
    return res.status(400).json({
      ...errorMessage,
      message: "User with this email doesn't exist.",
    });
  }

  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: true,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  sendMail({
    email: forgotEmail,
    subject: "OTP forgot password---Single Vendor Ecommerce",
    message: `Please don't share this with anyone.
    OTP: ${otp}`,
  });

  userExist.userOtp = otp;
  await userExist.save();

  res.status(200).json({
    ...successMessage,
    message: "Otp sent Successfully.",
  });
};

// verify OTP
exports.verifyOtp = async (req, res) => {
  const { forgotEmail, userOtp } = req.body;

  if (!forgotEmail || !userOtp) {
    return res.status(400).json({
      ...errorMessage,
      message: "Please enter all the data",
    });
  }

  const userExist = await User.findOne({
    userEmail: forgotEmail,
  });

  if (!userExist) {
    return res.status(400).json({
      ...errorMessage,
      message: "User with this Email doesn't exist.",
    });
  }

  const isOtpMatched = userOtp === userExist.userOtp;

  if (!isOtpMatched) {
    return res.status(400).json({
      ...errorMessage,
      message: "OTP didn't matched",
    });
  }

  // disposing otp
  userExist.userOtp = undefined;
  userExist.isOTPVerified = true;
  await userExist.save();

  res.status(200).json({
    ...successMessage,
    message: "Otp verified successfully.",
  });
};

// change password
exports.forgotPassword = async (req, res) => {
  const { forgotEmail, newPassword, confirmNewPassword } = req.body;

  if (!newPassword || !confirmNewPassword) {
    return res.status(400).json({
      ...errorMessage,
      message: "please enter all the data.",
    });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({
      ...errorMessage,
      message: "please enter the same password both the time.",
    });
  }

  const userExist = await User.findOne({ userEmail: forgotEmail });

  if (!userExist) {
    return res.status(400).json({
      ...errorMessage,
      message: "User with this email doesn't exist.",
    });
  }

  if (!userExist.isOTPVerified) {
    return res.status(400).json({
      ...errorMessage,
      message: "verify you otp first.",
    });
  }

  if (bcrypt.compareSync(confirmNewPassword, userExist.userPassword)) {
    return res.status(400).json({
      ...errorMessage,
      message: "This password has already been used.",
    });
  }

  userExist.userPassword = bcrypt.hashSync(confirmNewPassword, 10);
  userExist.isOTPVerified = false;
  await userExist.save();

  res.status(200).json({
    ...successMessage,
    message: "password changed successfully.",
  });
};
