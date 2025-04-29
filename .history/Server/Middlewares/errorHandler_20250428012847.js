const ErrorResponse = require("../Util/ErrorResponse");
const chalk = require("chalk"); // Import chalk

// REQUESTED PAGE IS NOT FOUND
module.exports.notFound = (req, res, next) => {
  const error = new ErrorResponse(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports.errorHandler = (err, req, res, next) => {
  // Log to console for dev with chalk
  console.log(chalk.red(err.message || "An error occurred")); // Use chalk.red
  console.log(chalk.red(err.stack || "No stack trace available"));

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    errors: {
      body: [err.message || "Internal Server Error"],
    },
  });
};
