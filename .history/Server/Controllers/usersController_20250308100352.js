const createError = require("http-errors");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { uploadToCloudinary, getFilePath } = require("../Util/uploadFile");
const { generateAccessToken, generateRefreshToken } = require("../Util/auth");

// Optional field validation helper. Throws an error if the field is missing.
const fieldValidation = (field) => {
  if (!field) {
    throw createError(400, "Missing required fields");
  }
};

/**
 * Create a new user
 */
exports.createUser = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);
    const { username, email, role, contact_number, location, password } =
      req.body;

    // Validate required fields.
    fieldValidation(username);
    fieldValidation(email);
    fieldValidation(role);
    fieldValidation(contact_number);
    fieldValidation(location);
    fieldValidation(password);

    // Check for existing username
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return next(createError(400, "Username is already taken."));
    }
    // Check for existing email
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return next(createError(400, "Email is already registered."));
    }

    let imageUrl = "";
    if (req.file) {
      const imagePath = getFilePath(req.file.filename);
      const imageMimeType = req.file.mimetype.split("/").pop();
      imageUrl = await uploadToCloudinary(
        imagePath,
        "profile-image",
        req.file.filename,
        imageMimeType
      );
    }

    // Create user. (Note: password hashing is handled by the model hook)
    const newUser = await User.create({
      username,
      email,
      role,
      image: imageUrl,
      contact_number,
      location,
      password,
    });

    const userObj = newUser.get({ plain: true });
    delete userObj.password;

    // Generate an access token (adjust as needed)
    const token = generateAccessToken(newUser.id);
    userObj.token = token;

    res.status(201).json({ user: userObj });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

/**
 * Login a user
 */
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    fieldValidation(email);
    fieldValidation(password);

    // Find the user by email.
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(createError(400, "User not found!"));
    }

    // Compare passwords.
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return next(createError(400, "Incorrect email and password!"));
    }

    // Update last login and save.
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens.
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Set tokens as HTTP-only cookies.
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

    const userObj = user.get({ plain: true });
    delete userObj.password;

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Login Successfully",
        accessToken,
        refreshToken,
        user_data: userObj,
        isPartner: false,
      },
    });
  } catch (error) {
    return next(createError(500, "Server error while login."));
  }
};

/**
 * Get the current logged-in user (only for role "Farmer")
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findOne({
      where: { id: userId, role: "Farmer" },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user details:", err);
    return res
      .status(500)
      .json({ message: "Database error", error: err.message });
  }
};

/**
 * Update user details
 */
exports.updateUser = async (req, res, next) => {
  try {
    // Use req.body.user if available, otherwise use req.body directly.
    const payload = req.body.user || req.body;
    const {
      username,
      email,
      role,
      contact_number,
      location,
      currentPassword,
      newPassword,
      confirmPassword,
    } = payload;

    // Fetch the current user using req.user.id (set by your auth middleware)
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Validate role if provided.
    if (role && !["Farmer", "Buyer"].includes(role)) {
      return next(createError(400, "Invalid role provided"));
    }

    // Validate contact number.
    if (contact_number) {
      const contactStr = contact_number.toString();
      if (
        !/^\d+$/.test(contactStr) ||
        contactStr.length < 10 ||
        contactStr.length > 15
      ) {
        return next(createError(400, "Invalid contact number"));
      }
    }

    // If updating password, validate current password and confirmation.
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        return next(
          createError(400, "Current password is required to update password")
        );
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return next(createError(401, "Current password is incorrect"));
      }
      if (newPassword !== confirmPassword) {
        return next(
          createError(400, "New password and confirmation do not match")
        );
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update other fields if provided.
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (contact_number) user.contact_number = contact_number;
    if (location) user.location = location;

    await user.save();

    const updatedUser = user.get({ plain: true });
    delete updatedUser.password;
    updatedUser.token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

/**
 * Logout user by clearing token cookie
 */
exports.logoutUser = async (req, res, next) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
