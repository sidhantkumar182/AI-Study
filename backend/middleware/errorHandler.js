import multer from "multer";

const handleMulterError = (err) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return { statusCode: 413, message: "File too large. Maximum allowed size exceeded" };
  }
  return { statusCode: 400, message: err.message || "File upload error" };
};

const handleMongooseValidationError = (err) => {
  const messages = Object.values(err.errors).map((val) => val.message);
  return { statusCode: 400, message: messages.join(", ") };
};

const handleMongooseCastError = (err) => {
  return { statusCode: 400, message: `Invalid ${err.path}: ${err.value}` };
};

const handleMongooseDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue || {})[0];
  return { statusCode: 409, message: `${field} already exists` };
};

const handleJWTError = () => {
  return { statusCode: 401, message: "Invalid or expired token" };
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof multer.MulterError) {
    ({ statusCode, message } = handleMulterError(err));
  } else if (err.name === "ValidationError" && err.errors) {
    ({ statusCode, message } = handleMongooseValidationError(err));
  } else if (err.name === "CastError") {
    ({ statusCode, message } = handleMongooseCastError(err));
  } else if (err.code === 11000) {
    ({ statusCode, message } = handleMongooseDuplicateKeyError(err));
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    ({ statusCode, message } = handleJWTError());
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
