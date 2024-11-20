const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./Routes/auth");

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
