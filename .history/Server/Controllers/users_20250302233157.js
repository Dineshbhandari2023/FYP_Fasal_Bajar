const asyncHandler = require("../Middlewares/asyncHandler");
const User = require("../Models/user");
const ErrorResponse = require("../Util/ErrorResponse");
const { sign } = require("../Util/jwt");

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
      email: email,
    },
  });

  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
  }

  const isMatch = user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Wrong password", 401));
  }

  delete user.dataValues.password;

  user.dataValues.token = await sign(user);

  user.dataValues.role = null;
  user.dataValues.location = null;

  res.status(200).json({ user });
  localStorage.setItem("userToken", response.data.user.token);
});

module.exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const { loggedUser } = req;
  const user = await User.findByPk(loggedUser.id);

  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
  }

  user.dataValues.token = req.headers.authorization.split(" ")[1];

  res.status(200).json({ user });
});

module.exports.updateUser = asyncHandler(async (req, res, next) => {
  await User.update(req.body.user, {
    where: {
      id: req.user.id,
    },
  });

  const user = await User.findByPk(req.user.id);
  user.dataValues.token = req.headers.authorization.split(" ")[1];

  res.status(200).json({ user });
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
