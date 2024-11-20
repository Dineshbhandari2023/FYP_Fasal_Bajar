const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.json({
    data: "You had hits on signup endpoint",
  });
});
module.exports = router;
