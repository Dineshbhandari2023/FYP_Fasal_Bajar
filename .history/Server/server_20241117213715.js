const express = require("express");
const app = express();

app.use(express.json());

// import routes
const authRoutes = require("./Routes/auth");

// Middleware
app.use("/api", authRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
