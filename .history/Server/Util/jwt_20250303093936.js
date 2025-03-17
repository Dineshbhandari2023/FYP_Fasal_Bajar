// const { response } = require("express");
// const jwt = require("jsonwebtoken");

// module.exports.sign = async (payload, secret, options) => {
//   //   const token = await jwt.sign(
//   //     { id: user.id, username: user.username, email: user.email },
//   //     process.env.JWT_SECRET,
//   //     {
//   //       expiresIn: process.env.JWT_EXPIRE || "1d",
//   //     }
//   //   );
//   //   return token;
//   // };
//   // After validating the user's password
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "24h",
//   });
//   response.json({
//     token,
//     user: {
//       id: user._id,
//       email: user.email,
//       username: user.username,
//       role: user.role,
//       contact_number: user.contact_number,
//       location: user.location,
//     },
//   });
//   return jwt.sign(payload, secret, options);
// };
// // module.exports.verify = async (token) => {
// //   const decoded = await jwt.verify(token, process.env.JWT_SECRET);
// //   return decoded;
// // };
// module.exports.verify = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET);
// };

const jwt = require("jsonwebtoken");

// Function to sign JWT
module.exports.sign = (payload, secret, options) => {
  return jwt.sign(payload, secret, options);
};

// Function to verify JWT
module.exports.verify = (token, secret) => {
  try {
    return { valid: true, decoded: jwt.verify(token, secret) };
  } catch (error) {
    return { valid: false, error };
  }
};
