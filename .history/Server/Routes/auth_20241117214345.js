const express = require("express");
const router = express.Router();
const { signup } = require("/Controller/auth/signup");

router.get("/signup", signup);
module.exports = router;
