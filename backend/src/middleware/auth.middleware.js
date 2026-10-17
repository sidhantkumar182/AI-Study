/**
 * src/middleware/auth.middleware.js
 * JWT authentication middleware.
 * Attaches req.user to the request if the token is valid.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { sendUnauthorized } = require('../utils/response');

/**
 * protect — Requires a valid JWT token.
 * Checks Authorization header (Bearer token) or httpOnly cookie.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2. Fallback: check httpOnly cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendUnauthorized(res, 'Access denied. No token provided.');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user — exclude password
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendUnauthorized(res, 'User no longer exists.');
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendUnauthorized(res, 'Invalid token.');
    }
    if (error.name === 'TokenExpiredError') {
      return sendUnauthorized(res, 'Token has expired. Please log in again.');
    }
    next(error);
  }
};

/**
 * optionalAuth — Attaches user to req if token is present, but doesn't block if absent.
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    }
    next();
  } catch {
    next(); // silently continue without user
  }
};

module.exports = { protect, optionalAuth };
