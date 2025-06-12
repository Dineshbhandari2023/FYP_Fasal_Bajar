const ErrorResponse = require("../Util/errorResponse");

// REQUESTED PAGE IS NOT FOUND
module.exports.notFound = (req, res, next) => {
  const error = new ErrorResponse(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports.errorHandler = (err, req, res, next) => {
  // Log to console for dev
  console.log(err.message || "An error occurred");
  console.log(err.stack || "No stack trace available");

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    errors: {
      body: [err.message || "Internal Server Error"],
    },
  });
};
