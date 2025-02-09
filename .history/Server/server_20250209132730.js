const express = require("express");
const sequelize = require("./Util/database");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const { errorHandler } = require("./Middlewares/errorHandler");

// Import Models
const User = require("./Models/User");

dotenv.config({ path: "config.env" });

const app = express();

// Body parser
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Route files
const users = require("./routes/users");
const profiles = require("./routes/profiles");

// Mount routers
app.use(users);
app.use(profiles);

const PORT = process.env.PORT || 8000;

app.use(errorHandler);

const sync = async () => await sequelize.sync({ force: true });
sync().then(() => {
  User.create({
    email: "test@test.com",
    password: "123456",
    username: "neo",
  });
  User.create({
    email: "test2@test.com",
    password: "123456",
    username: "celeb_neo",
  });
});

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
