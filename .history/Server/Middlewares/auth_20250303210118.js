const jwt = require("jsonwebtoken");
const ErrorResponse = require("../Util/ErrorResponse");
const User = require("../Models/user");

module.exports.protect = async (req, res, next) => {
  // let token; // Declare token at the top of the function to ensure it's available throughout

  // if (
  //   req.header.authorization &&
  //   req.header.authorization.startsWith("Bearer ")
  // ) {
  //   const parts = req.header.authorization.split(" ");
  //   if (parts.length === 2) {
  //     token = parts[1];
  //   } else {
  //     return next(new ErrorResponse("Bearer token malformed", 401));
  //   }
  // } else {
  //   return next(new ErrorResponse("Not authorized to access this route", 401));
  // }

  // // This try-catch block is necessary for catching any issues that arise from token verification
  // try {
  //   // Verify token
  //   const decoded = jwt.verify(
  //     token,
  //     process.env.JWT_SECRET || "DineshBhandari"
  //   ); // Use environment variable with a fallback
  //   const user = await User.findOne({ _id: decoded.id });

  //   if (!user) {
  //     return next(new ErrorResponse("User not logged in", 401));
  //   }

  //   // Attach user and token to the request object
  //   req.user = user;
  //   req.token = token;
  //   next();
  // } catch (err) {
  //   console.error("JWT verification error:", err);
  //   next(new ErrorResponse("Token is not valid", 401));
  // }
  const token = req.header("Authorization");
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
  const jwtToken = token.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    console.log(user);

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return next(new ErrorResponse("Token is not valid", 401));
  }
};
