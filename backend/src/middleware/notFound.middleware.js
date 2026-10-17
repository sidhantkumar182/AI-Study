/**
 * src/middleware/notFound.middleware.js
 * Catches requests to unknown routes and returns a 404 JSON response.
 */

const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errors: [],
  });
};

module.exports = notFoundMiddleware;
