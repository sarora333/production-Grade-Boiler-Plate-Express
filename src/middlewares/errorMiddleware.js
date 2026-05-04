import ApiResponse from "../utils/apiRes.js";
import ApiError from "../utils/apiErrror.js";
import logger from "../utils/logger.js";

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json(
    new ApiResponse(
      err.statusCode,
      {
        error: err,
        stack: err.stack,
        status: err.status,
      },
      err.message,
    ),
  );
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res
      .status(err.statusCode)
      .json(
        new ApiResponse(err.statusCode, { status: err.status }, err.message),
      );
  } else {
    logger.error(err);
    res
      .status(500)
      .json(new ApiResponse(500, { status: "error" }, "something went wrong"));
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Clone so we don't mutate the original error
  let error = { ...err, name: err.name, message: err.message };

  // Mongoose: Invalid ObjectId
  if (err.name === "CastError") {
    error = new ApiError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // Mongoose: Duplicate key (e.g. unique index violation)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    error = new ApiError(`Duplicate value for field: ${field}`, 409);
  }

  // Mongoose: Validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(messages.join(", "), 400);
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error.statusCode ? error : err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(error.statusCode ? error : err, res);
  }
};

export default globalErrorHandler;
