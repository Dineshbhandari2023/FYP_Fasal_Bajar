const { verify } = require("../Util/jwt");
const User = require("../Models/user");
const ErrorResponse = require("../Util/ErrorResponse");
const jwt = require("jsonwebtoken");

// PROTECT MIDDLEWARE
exports.protect = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    console.log("Authorization Header:", authorization);

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new ErrorResponse("No token provided", 401));
    }

    const token = authorization.split(" ")[1];
    console.log("Extracted Token:", token);

    const decoded = await verify(token);
    console.log("Decoded Token:", decoded);

    if (!decoded || !decoded.sub) {
      return next(new ErrorResponse("Invalid token", 401));
    }

    const user = await User.findByPk(decoded.sub, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    req.loggedUser = user;

    next();
  } catch (error) {
    console.error("Protect Middleware Error:", error);
    next(new ErrorResponse("Not authorized", 401));
  }
};

// JWT GENERATORS
exports.generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ sub: user.id }, process.env.JWT_REFRESH, {
    expiresIn: "24h",
  });
};
