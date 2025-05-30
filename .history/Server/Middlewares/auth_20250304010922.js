// const jwt = require("jsonwebtoken");
// const ErrorResponse = require("../Util/ErrorResponse");
// const User = require("../Models/user");

// module.exports.protect = async (req, res, next) => {
//   let token; // Declare token at the top of the function to ensure it's available throughout

//   if (
//     req.header.authorization &&
//     req.header.authorization.startsWith("Bearer ")
//   ) {
//     const parts = req.header.authorization.split(" ");
//     if (parts.length === 2) {
//       token = parts[1];
//     } else {
//       return next(new ErrorResponse("Bearer token malformed", 401));
//     }
//   } else {
//     return next(new ErrorResponse("Not authorized to access this route", 401));
//   }

//   // This try-catch block is necessary for catching any issues that arise from token verification
//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use environment variable with a fallback
//     const user = await User.findOne({ _id: decoded.id });
//     // req.user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return next(new ErrorResponse("User not logged in", 401));
//     }

//     // Attach user and token to the request object
//     req.user = user;
//     req.token = token;
//     next();
//   } catch (err) {
//     console.error("JWT verification error:", err);
//     next(new ErrorResponse("Token is not valid", 401));
//   }
// };

// import jwt from "jsonwebtoken";
// import asyncHandler from "express-async-handler";
// import User from "../Models/user";
const jwt = require("jsonwebtoken");
const asyncHandler = require("async-handler");
const User = require("../Models/user");

module.exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// export { protect };
