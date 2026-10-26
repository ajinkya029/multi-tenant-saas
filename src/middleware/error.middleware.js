function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}
function errorHandler(err, _req, res, _next) {
  if (err && err.code === 11000) {
    return res.status(409).json({ error: "Conflict", message: "A record with that unique value already exists" });
  }
  const status = err.statusCode || 500;
  const body = { error: status >= 500 ? "Internal Server Error" : err.message, message: status >= 500 ? "Something went wrong" : err.message };
  if (err.details) body.details = err.details;
  if (process.env.NODE_ENV !== "production" && status >= 500) body.debug = err.message;
  res.status(status).json(body);
}
module.exports = { notFound, errorHandler };
