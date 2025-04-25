// jwt.js
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../Models/user"); // Ensure this path is correct

// List of public routes that don't require authentication
const publicRoutes = [
  { path: "/users/suppliers", method: "GET" }, // Make supplier listing public
  { path: "/users/:id", method: "GET" }, // Make individual supplier details public
];

const authMiddleWare = async (req, res, next) => {
  try {
    // Check if the current route is in the public routes list
    const isPublicRoute = publicRoutes.some((route) => {
      // Convert route path pattern to regex for matching
      const pathPattern = route.path.replace(/:\w+/g, "[^/]+");
      const pathRegex = new RegExp(`^${pathPattern}$`);

      return route.method === req.method && pathRegex.test(req.path);
    });

    // If it's a public route, skip authentication
    if (isPublicRoute) {
      return next();
    }

    // Otherwise, proceed with authentication
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findOne({ where: { id: decoded.user_id } });
      if (!user) {
        return next(createError(401, "User not found"));
      }
      req.user = user;
      return next();
    } else {
      return next(createError(401, "Unauthorized access"));
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return next(createError(401, "Token verification failed"));
  }
};

module.exports = { authMiddleWare };
