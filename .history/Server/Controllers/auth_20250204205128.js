// exports.signup = (req, res) => {
//   res.json({
//     data: "You had hits on signup endpoint yay",
//   });
// };

const asyncHandler = require("../Middlewares/asyncHandler");
const User = require("../Models/User");
const ErrorResponse = require("../Util/errorResponse");
const { sign } = require("../Util/jwt");

module.exports.createUser = asyncHandler(async (req, res, next) => {
  const { username, email, role, contact_number, location, password } =
    req.body.user;

  fieldValidation(username, next);
  fieldValidation(email, next);
  fieldValidation(role, next);
  fieldValidation(contact_number, next);
  fieldValidation(location, next);
  fieldValidation(password, next);

  const user = await User.create({
    username: username,
    email: email,
    role: role,
    contact_number: contact_number,
    location: location,
    password: password,
  });

  if (user.dataValues.password) {
    delete user.dataValues.password;
  }

  user.dataValues.token = await sign(user);

  res.status(201).json({ user });
});

module.exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body.user;

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

const fieldValidation = (field, next) => {
  if (!field) {
    return next(new ErrorResponse(`Missing fields`, 400));
  }
};
