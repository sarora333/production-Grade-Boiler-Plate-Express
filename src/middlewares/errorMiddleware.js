import ApiResponse from "../utils/apiRes.js";

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
    console.log("error", err);
    res
      .status(500)
      .json(new ApiResponse(500, { status: "error" }, "something went wrong"));
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};

export default globalErrorHandler;
