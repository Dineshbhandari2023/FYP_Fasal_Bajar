const express = require("express");
const router = express.Router();
const { signup } = require("../Controllers/auth");

router.get("/signup", signup);
module.exports = router;
