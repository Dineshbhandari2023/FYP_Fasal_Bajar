const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/signup", (req, res) => {
  res.json({
    data: "You had hits on signup endpoint",
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${PORT}`);
});
