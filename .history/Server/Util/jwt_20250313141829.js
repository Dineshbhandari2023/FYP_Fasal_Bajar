const jwt = require("jsonwebtoken");
const { User } = require("../Models/user");
require("dotenv").config();

const authMiddleWare = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader); // Debug log
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized", ok: false });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decodedToken); // Debug log
    const { user_id } = decodedToken;
    const user = await User.findOne({ where: { id: user_id } });
    console.log("User found:", user); // Debug log
    if (!user) {
      return res.status(401).json({ message: "Please Login Again", ok: false });
    }
    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Your account has been Blocked", ok: false });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: error.message, ok: false });
  }
};

module.exports = { authMiddleWare };
