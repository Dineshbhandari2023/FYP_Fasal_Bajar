const jwt = require("jsonwebtoken");
const ErrorResponse = require("../Util/ErrorResponse");

module.exports.protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2) {
      token = parts[1];
    } else {
      return next(new ErrorResponse("Bearer token malformed", 401));
    }
  }

  // If no token is found, return an error
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token using JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.loggedUser = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return next(new ErrorResponse("Token is not valid", 401));
  }
};
