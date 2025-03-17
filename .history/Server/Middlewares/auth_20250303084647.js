// const jwt = require("jsonwebtoken");
// const ErrorResponse = require("../Util/ErrorResponse");

// module.exports.protect = (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer ")
//   ) {
//     const parts = req.headers.authorization.split(" ");
//     if (parts.length === 2) {
//       token = parts[1];
//     } else {
//       return next(new ErrorResponse("Bearer token malformed", 401));
//     }
//   }

//   // If no token is found, return an error
//   if (!token) {
//     return next(new ErrorResponse("Not authorized to access this route", 401));
//   }

//   try {
//     // Verify token using JWT_SECRET from .env
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.loggedUser = { id: decoded.id, email: decoded.email };
//     next();
//   } catch (err) {
//     console.error("JWT verification error:", err);
//     return next(new ErrorResponse("Token is not valid", 401));
//   }
// };

const jwt = require("jsonwebtoken");
const ErrorResponse = require("../Util/ErrorResponse");
const User = require("../Models/user");

module.exports.protect = async (req, res, next) => {
  // let token;

  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer ")
  // ) {
  //   const parts = req.headers.authorization.split(" ");
  //   if (parts.length === 2) {
  //     token = parts[1];
  //   } else {
  //     return next(new ErrorResponse("Bearer token malformed", 401));
  //   }
  // } else {
  //   return next(new ErrorResponse("Not authorized to access this route", 401));
  // }

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.loggedUser = { id: decoded.id, email: decoded.email };
  //   next();
  // } catch (err) {
  //   console.error("JWT verification error:", err);
  //   return next(new ErrorResponse("Token is not valid", 401));
  // }
  const token = req.header("Authorization").replace("Bearer ", "");
  const decode = jwt.verify(token, "DineshBhandari");
  try {
    if (!decode) {
      return res.status(401).send({ error: "no auth token" });
    }
    const user = await User.findOne({ _id: decode._id });
    if (!user) {
      return res.json("user not loged in");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ error: "no auth token" });
  }
};
