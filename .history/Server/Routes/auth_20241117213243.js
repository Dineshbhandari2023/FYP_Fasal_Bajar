const express = require("express");
const router = express.Router();

router.get("/api/signup", (req, res) => {
  res.json({
    data: "You had hits on signup endpoint",
  });
});
