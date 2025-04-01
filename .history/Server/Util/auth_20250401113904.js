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

// Define the function that generates a JWT for a user
exports.generateAccessToken = (user) => {
  // For example, sign a payload with the user id
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};
