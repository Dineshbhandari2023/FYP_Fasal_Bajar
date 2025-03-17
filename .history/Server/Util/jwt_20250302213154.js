const jwt = require("jsonwebtoken");

module.exports.sign = async (user) => {
  const token = await jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "1d",
    }
  );
  return token;
};

// module.exports.verify = async (token) => {
//   const decoded = await jwt.verify(token, process.env.JWT_SECRET);
//   return decoded;
// };
module.exports.verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
