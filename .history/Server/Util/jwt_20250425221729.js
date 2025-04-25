// jwt.js
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../Models/user"); // Ensure this path is correct

const authMiddleWare = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Line 16 (or nearby) might look like:
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
