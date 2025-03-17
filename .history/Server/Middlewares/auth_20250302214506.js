// const { verify } = require("../Util/jwt");
// const User = require("../Models/user");
// const ErrorResponse = require("../Util/ErrorResponse");

// exports.protect = async (req, res, next) => {
//   try {
//     const { headers } = req;
//     if (!headers.authorization) return next();

//     const token = headers.authorization.split(" ")[1];
//     if (!token) throw new SyntaxError("Token missing or malformed");

//     const userVerified = await verify(token);
//     if (!userVerified) throw new Error("Invalid Token");

//     req.loggedUser = await User.findOne({
//       attributes: { exclude: ["email", "password"] },
//       where: { email: userVerified.email },
//     });

//     if (!req.loggedUser) next(new NotFoundError("User"));

//     headers.email = userVerified.email;
//     req.loggedUser.dataValues.token = token;

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// Middlewares/auth.js
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../Util/ErrorResponse");

module.exports.protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded info to req, for use in controllers.
    req.loggedUser = { id: decoded.id };
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return next(new ErrorResponse("Token is not valid", 401));
  }
};
