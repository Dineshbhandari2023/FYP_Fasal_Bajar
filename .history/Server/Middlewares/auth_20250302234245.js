const jwt = require("jsonwebtoken");
const ErrorResponse = require("../Util/ErrorResponse");

module.exports.protect = (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer "
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // Extract the token after "Bearer "
    token = req.headers.authorization.split(" ")[1];
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
