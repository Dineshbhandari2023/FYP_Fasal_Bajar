const jwt = require("jsonwebtoken");
const createError = require("http-errors");

exports.protect = (req, res, next) => {
  let token;

  // Check if token is provided in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Otherwise, check for the token in cookies (set during login)
  else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(createError(401, "No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Optionally, load full user data here if needed
    next();
  } catch (error) {
    return next(createError(401, "Invalid token"));
  }
};
