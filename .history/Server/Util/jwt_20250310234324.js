const jwt = require("jsonwebtoken");

exports.sign = async (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1d",
  });
};

exports.verify = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
