const { verify } = require("../Util/jwt");
const User = require("../Models/user");
const ErrorResponse = require("../Util/ErrorResponse");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    const { headers } = req;
    if (!headers.authorization) return next();

    const token = headers.authorization.split(" ")[1];
    if (!token) throw new SyntaxError("Token missing or malformed");

    const userVerified = await verify(token);
    if (!userVerified) throw new Error("Invalid Token");

    req.loggedUser = await User.findOne({
      attributes: { exclude: ["email", "password"] },
      where: { email: userVerified.email },
    });

    if (!req.loggedUser) next(new NotFoundError("User"));

    headers.email = userVerified.email;
    req.loggedUser.dataValues.token = token;

    next();
  } catch (error) {
    next(error);
  }
};

exports.generateAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
};

exports.generateRefreshToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.JWT_REFRESH, {
    expiresIn: "24h",
  });
};
