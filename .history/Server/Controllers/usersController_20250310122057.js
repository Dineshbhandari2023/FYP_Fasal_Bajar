const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const User = require("../Models/user");
const { generateAccessToken, generateRefreshToken } = require("../Util/auth");
const config = require("../config/config");
const { uploadToCloudinary, getFilePath } = require("../Util/uploadFile");
require("dotenv").config();

// Regular expressions for validation
const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Global Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587, // use 465 for secure connection
  secure: false, // set to true if using port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify the transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error with nodemailer transporter:", error);
  } else {
    console.log("Nodemailer is ready to send emails.");
  }
});

// Register a new user
const registerUser = async (req, res, next) => {
  const { username, email, role, contact_number, location, password } =
    req.body;

  if (
    !username ||
    !email ||
    !role ||
    !contact_number ||
    !location ||
    !password
  ) {
    return next(createError(400, "All fields are required."));
  }

  // Role must be either "Farmer" or "Buyer"
  if (role !== "Farmer" && role !== "Buyer") {
    return next(createError(400, "Role must be either 'Farmer' or 'Buyer'."));
  }

  if (!usernameRegex.test(username)) {
    return next(
      createError(
        400,
        "Username must be alphanumeric and between 3 to 20 characters long."
      )
    );
  }

  if (!emailRegex.test(email)) {
    return next(createError(400, "Invalid email format."));
  }

  if (!passwordRegex.test(password)) {
    return next(createError(400, "Password must be strong!"));
  }

  const contactStr = contact_number.toString();
  if (contactStr.length < 10 || contactStr.length > 15) {
    return next(
      createError(400, "Contact number must be between 10 to 15 digits.")
    );
  }

  try {
    // Check for duplicate username, email, or contact number
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return next(createError(400, "Username is already taken."));
    }
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return next(createError(400, "Email is already registered."));
    }
    const existingContact = await User.findOne({ where: { contact_number } });
    if (existingContact) {
      return next(createError(400, "Contact number is already registered."));
    }

    let imageUrl = "";
    if (req.file) {
      const imagePath = getFilePath(req.file.filename);
      const imageMimeType = req.file.mimetype.split("/").pop();
      imageUrl = await uploadToCloudinary(
        imagePath,
        "profile-images",
        req.file.filename,
        imageMimeType
      );
    }

    // Create the user – note that the password hashing is handled by the beforeCreate hook.
    const newUser = await User.create({
      username,
      email,
      role,
      contact_number,
      location,
      password,
      image: imageUrl,
    });

    // Remove password from the returned object
    const userObj = newUser.toJSON();
    delete userObj.password;

    const welcomeMailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Welcome to Agro Connect - Empowering Nepali Agriculture!",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h1>Welcome, ${username}!</h1>
            <p>Thank you for joining Agro Connect – the digital platform that bridges the gap between Nepali farmers and buyers.</p>
            <p>Start exploring the platform to showcase your produce or discover high-quality agricultural products.</p>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(welcomeMailOptions);

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "User registered successfully",
        user_data: userObj,
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while creating new user."));
  }
};

// Login an existing user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createError(400, "All fields are required!"));
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(createError(400, "User not found!"));
    }
    const passMatch = await user.matchPassword(password);
    if (!passMatch) {
      return next(createError(400, "Incorrect email or password!"));
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 60 * 1000,
    });

    // Remove password from response
    const userObj = user.toJSON();
    delete userObj.password;

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Login successful",
        accessToken,
        refreshToken,
        user_data: userObj,
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error during login."));
  }
};

// Forgot Password – sends a reset code via email
// (Ensure your User model has optional fields: resetPasswordCode, resetPasswordCodeExpires, lastPasswordResetRequest)
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(createError(400, "Email is required."));
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(createError(400, "Email not found."));
    }
    const cooldownPeriod = 5 * 60 * 1000;
    const now = Date.now();
    if (
      user.lastPasswordResetRequest &&
      now - user.lastPasswordResetRequest < cooldownPeriod
    ) {
      return next(
        createError(429, "Too many requests. Please try again later.")
      );
    }
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetPasswordCode = resetCode;
    user.resetPasswordCodeExpires = now + 600000; // valid for 10 minutes
    user.lastPasswordResetRequest = now;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request - Agro Connect",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h1>Password Reset Request</h1>
            <p>Hello ${user.username},</p>
            <p>Your password reset code is: <strong>${resetCode}</strong></p>
            <p>This code is valid for 10 minutes.</p>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: { message: "Password reset email sent successfully." },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while processing forgot password."));
  }
};

// Verify reset code
const verifyResetCode = async (req, res, next) => {
  const { resetCode } = req.body;
  if (!resetCode) {
    return next(createError(400, "Reset code is required."));
  }
  try {
    const now = Date.now();
    const user = await User.findOne({
      where: {
        resetPasswordCode: resetCode,
        resetPasswordCodeExpires: { [Op.gt]: now },
      },
    });
    if (!user) {
      return next(createError(400, "Invalid or expired reset code."));
    }
    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: { message: "Reset code verified successfully." },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while verifying reset code."));
  }
};

// Reset password using the reset code
const resetPassword = async (req, res, next) => {
  const { resetCode, newPassword } = req.body;
  if (!resetCode || !newPassword) {
    return next(createError(400, "Reset code and new password are required."));
  }
  if (!passwordRegex.test(newPassword)) {
    return next(createError(400, "Password must be strong!"));
  }
  try {
    const now = Date.now();
    const user = await User.findOne({
      where: {
        resetPasswordCode: resetCode,
        resetPasswordCodeExpires: { [Op.gt]: now },
      },
    });
    if (!user) {
      return next(createError(400, "Invalid or expired reset code."));
    }
    // Ensure the new password is different from the current password
    const isMatch = await user.matchPassword(newPassword);
    if (isMatch) {
      return next(
        createError(
          400,
          "New password must be different from the old password."
        )
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordCode = null;
    user.resetPasswordCodeExpires = null;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });

    const confirmationMailOptions = {
      to: user.email,
      from: config.emailUser,
      subject: "Password Changed Successfully - Agro Connect",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h1>Password Changed Successfully</h1>
            <p>Hello ${user.username},</p>
            <p>Your password has been changed successfully.</p>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(confirmationMailOptions);

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: { message: "Password has been reset successfully." },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while processing password reset."));
  }
};

// Refresh access token using the provided refresh token
const refreshAccessToken = async (req, res, next) => {
  const incomingRefreshToken = req.body.refreshToken;
  if (!incomingRefreshToken) {
    return next(
      createError(400, "Unauthorized request: No refresh token provided")
    );
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(incomingRefreshToken, config.refreshTokenSecret);
  } catch (error) {
    return next(createError(400, "Invalid refresh token"));
  }

  const userId = decodedToken.sub;
  const newAccessToken = generateAccessToken(userId);

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 30 * 60 * 1000,
  });

  res.status(200).json({
    StatusCode: 200,
    IsSuccess: true,
    ErrorMessage: [],
    Result: { accessToken: newAccessToken },
  });
};

// Get all users with pagination
const getAllUsers = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    const { count, rows } = await User.findAndCountAll({
      offset,
      limit,
      attributes: { exclude: ["password"] },
    });
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Users fetched successfully",
        data: rows,
        pagination: {
          totalUsers: count,
          totalPages,
          currentPage: page,
          pageSize: rows.length,
        },
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while fetching users."));
  }
};

// Get a single user by ID
const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return next(createError(404, "User not found."));
    }
    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "User fetched successfully",
        user_data: user,
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while fetching user by ID."));
  }
};

// Handle logout by clearing the authentication cookies
const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: { message: "Logout successful" },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while logging out."));
  }
};

// usersController.js (example)
const getCurrentUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return next(createError(404, "User not found."));
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while fetching user."));
  }
};

const updateUser = async (req, res, next) => {
  const userId = req.user.id;
  const { username, email } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return next(createError(404, "User not found."));
    }

    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();

    const updatedUser = user.toJSON();
    delete updatedUser.password;

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: { message: "User updated successfully.", user: updatedUser },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while updating user."));
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  refreshAccessToken,
  getAllUsers,
  getUserById,
  handleLogout,
  getCurrentUser,
  updateUser,
};
