const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const globalErrorHandler = require("./middlewares/globalErrorHandler");
const userRouter = require("./users/userRouter");
const productRouter = require("./product/productRouter");

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());


app.use("/api/users", userRouter);
app.use("/api/product", productRouter);


app.use(globalErrorHandler);

module.exports = app;
