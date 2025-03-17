const { verify } = require("../Util/jwt");
const User = require("../Models/user");
const ErrorResponse = require("../Util/ErrorResponse");
const jwt = require("jsonwebtoken");

// PROTECT MIDDLEWARE
exports.protect = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new ErrorResponse("No token provided", 401));
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // <-- Verify access token

    if (!decoded || !decoded.sub) {
      return next(new ErrorResponse("Invalid token", 401));
    }

    const user = await User.findByPk(decoded.sub);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    req.loggedUser = user;

    next();
  } catch (error) {
    console.error("Protect Middleware Error:", error);
    return next(new ErrorResponse("Not authorized", 401));
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
    { expiresIn: "30m" } // <-- 30 minutes expiry!
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ sub: user.id }, process.env.JWT_REFRESH, {
    expiresIn: "24h",
  });
};
