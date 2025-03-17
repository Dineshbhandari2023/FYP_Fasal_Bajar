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
