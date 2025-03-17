const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const globalErrorHandler = require("./Middlewares/globalErrorHandler");
const productRouter = require("./product/productRouter");

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
