import { ENV } from "../config/env.js";

export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

export function errorHandler(error, req, res, next) {
  void next;

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: error.message || "Server error",
    stack: ENV.NODE_ENV === "production" ? undefined : error.stack,
  });
}
