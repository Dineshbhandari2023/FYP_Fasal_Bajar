const express = require("express");
const router = express.Router();
const { signup } = require("../Controllers/auth");

router.get("/signup", signup);
router.post("/signup", signup);
module.exports = router;
