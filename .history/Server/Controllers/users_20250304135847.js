const asyncHandler = require("../Middlewares/asyncHandler");
const User = require("../Models/user");
const ErrorResponse = require("../Util/ErrorResponse");
const { sign } = require("../Util/jwt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.createUser = asyncHandler(async (req, res, next) => {
  console.log("Request Body:", req.body); // Debugging

  const { username, email, role, contact_number, location, password } =
    req.body;

  fieldValidation(username, next);
  fieldValidation(email, next);
  fieldValidation(role, next);
  fieldValidation(contact_number, next);
  fieldValidation(location, next);
  fieldValidation(password, next);

  const user = await User.create({
    username,
    email,
    role,
    contact_number,
    location,
    password,
  });

  if (user.dataValues.password) {
    delete user.dataValues.password;
  }

  user.dataValues.token = await sign(user);

  res.status(201).json({ user });
});

module.exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  fieldValidation(email, next);
  fieldValidation(password, next);

  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
  }

  const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  if (!passwordIsValid) {
    return res.status(401).send({
      message: "Invalid Password!",
    });
  }

  delete user.dataValues.password;

  user.dataValues.token = await sign(user);

  user.dataValues.role = user.role;
  user.dataValues.location = user.location;

  res.status(200).json({ token: user.dataValues.token, user });
});

module.exports.getCurrentUser = asyncHandler(async (req, res) => {
  // const { loggedUser } = req;
  // const user = await User.findByPk(loggedUser.id);

  // if (!user) {
  //   return next(new ErrorResponse(`User not found`, 404));
  // }

  // delete user.dataValues.password;

  // user.dataValues.token = req.headers.authorization.split(" ")[1];
  // console.log("Token:", token);

  // res.status(200).json({ user });
  try {
    // Extract the token from Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Get token from 'Bearer <token>'

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Decode the token to get the user id (assuming the token contains user information)
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key here
    const userId = decoded.id;

    // Fetch the users's details using the userId
    const user = await User.findOne({
      where: { id: userId, role: "Farmer" },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Return the user's details
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching Users details:", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
});

// module.exports.updateUser = asyncHandler(async (req, res, next) => {
//   await User.update(req.body.user, {
//     where: {
//       id: req.user.id,
//     },
//   });

//   const user = await User.findByPk(req.user.id);
//   user.dataValues.token = req.headers.authorization.split(" ")[1];

//   res.status(200).json({ user });
// });

module.exports.updateUser = asyncHandler(async (req, res, next) => {
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

  // Fetch the current user using the id attached by the protect middleware.
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Validate role if provided (only "Farmer" and "Buyer" are allowed)
  if (role && !["Farmer", "Buyer"].includes(role)) {
    return next(new ErrorResponse("Invalid role provided", 400));
  }

  // Validate contact number: must be numeric and have length between 10 and 15
  if (contact_number) {
    const contactStr = contact_number.toString();
    if (
      !/^\d+$/.test(contactStr) ||
      contactStr.length < 10 ||
      contactStr.length > 15
    ) {
      return next(new ErrorResponse("Invalid contact number", 400));
    }
  }

  // Check if a password update is requested.
  if (currentPassword || newPassword || confirmPassword) {
    if (!currentPassword) {
      return next(
        new ErrorResponse(
          "Current password is required to update password",
          400
        )
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new ErrorResponse("Current password is incorrect", 401));
    }
    if (newPassword !== confirmPassword) {
      return next(
        new ErrorResponse("New password and confirmation do not match", 400)
      );
    }
    // Hash the new password and update it.
    user.password = await bcrypt.hash(newPassword, 10);
  }

  // Update other user details if provided.
  if (username) user.username = username;
  if (email) user.email = email;
  if (role) user.role = role;
  if (contact_number) user.contact_number = contact_number;
  if (location) user.location = location;
  if (newPassword) user.password = confirmPassword;

  // Save the updated user.
  await user.save();

  // Convert to JSON and remove password before returning.
  const updatedUser = user.toJSON();
  delete updatedUser.password;
  // Include the token from the request headers.
  updatedUser.token = req.headers.authorization.split(" ")[1];

  res.status(200).json({ user: updatedUser });
});

module.exports.logoutUser = asyncHandler(async (req, res, next) => {
  // If using cookies to store the token, clear the token cookie.
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000), // Cookie expires in 10 seconds
    httpOnly: true,
  });

  // Alternatively, if tokens are stored client-side (e.g., in localStorage),
  // simply instruct the client to remove the token.
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

const fieldValidation = (field, next) => {
  if (!field) {
    return next(new ErrorResponse(`Missing fields`, 400));
  }
};
