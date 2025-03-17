const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/user");
const dotenv = require("dotenv");
dotenv.config();

const authenticateToken = (req, res, next) => {
  const accessToken = req.headers["authorization"];
  if (!accessToken) {
    return next(createError(401, "Access Token not found"));
  }

  const token = accessToken.split(" ")[1];
  if (!token) {
    return next(createError(401, "Token is not valid"));
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (verified.exp < currentTimestamp) {
      return next(createError(401, "Token has expired"));
    }
    next();
  } catch (err) {
    next(createError(500, "Invalid Token"));
  }
};

const isFarmer = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.sub);
    if (!user || user.role !== "farmer") {
      return next(createError(403, "You are not farmer."));
    }
    next();
  } catch (err) {
    next(createError(500, "Server Error"));
  }
};

const verifyUserId = (req, res, next) => {
  const userId = req.params.id;
  if (req.user.sub !== userId) {
    return next(createError(403, "Access Denied. User ID does not match."));
  }
  next();
};

const isUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.sub);
    if (!user || user.role !== "user") {
      return next(createError(403, "Access Denied"));
    }
    next();
  } catch (err) {
    next(createError(500, "You are not allowed to access this user."));
  }
};

module.exports = {
  authenticateToken,
  isFarmer,
  isUser,
  verifyUserId,
};
