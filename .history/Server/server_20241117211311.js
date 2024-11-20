const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/signup", function (req, res) {
  res.json({
    data: "You had hits on signup endpoint",
  });
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
