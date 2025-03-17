const jwt = require("jsonwebtoken");

module.exports.sign = async (user) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// module.exports.verify = async (token) => {
//   const decoded = await jwt.verify(token, process.env.JWT_SECRET);
//   return decoded;
// };
// module.exports.verify = (req, res, next) => {
//   // return jwt.verify(token, process.env.JWT_SECRET);
//   const authHeader = req.headers.authorization;

//   if (!authHeader) return res.status(401).json({ status: 401 });

//   try {
//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);

//     console.log(decoded);
//     next();
//   } catch (err) {
//     console.log(err);
//   }
// };
