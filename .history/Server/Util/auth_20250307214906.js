const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, config.process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.REFRESH_TOKEN, {
    expiresIn: "24h",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
