/**
 * src/controllers/auth.controller.js
 *
 * POST /api/auth/register  — Register new user
 * POST /api/auth/login     — Login
 * POST /api/auth/logout    — Logout (clear cookie)
 * GET  /api/auth/me        — Get current user
 */

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');
const Analytics = require('../models/Analytics.model');
const StudyPlanner = require('../models/StudyPlanner.model');
const { sendSuccess, sendCreated, sendBadRequest, sendUnauthorized, sendConflict } = require('../utils/response');

// ── Helper: sign JWT and set cookie ──────────────────────────────────────────
const signTokenAndRespond = (res, user, statusCode = 200) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // Set httpOnly cookie
  const cookieExpiresDays = parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || 7;
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: cookieExpiresDays * 24 * 60 * 60 * 1000,
  });

  // Remove password from output
  const userData = user.toSafeObject ? user.toSafeObject() : { ...user._doc };
  delete userData.password;

  return res.status(statusCode).json({
    success: true,
    message: statusCode === 201 ? 'Account created successfully' : 'Logged in successfully',
    data: { token, user: userData },
  });
};

// ── Register ─────────────────────────────────────────────────────────────────
/**
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check existing user
  const existing = await User.findOne({ email });
  if (existing) return sendConflict(res, 'Email is already registered');

  // Create user
  const user = await User.create({ name, email, password });

  // Bootstrap analytics and planner for new user
  await Analytics.create({ user: user._id });
  await StudyPlanner.create({ user: user._id });

  signTokenAndRespond(res, user, 201);
});

// ── Login ─────────────────────────────────────────────────────────────────────
/**
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Fetch user with password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) return sendUnauthorized(res, 'Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return sendUnauthorized(res, 'Invalid email or password');

  if (!user.isActive) return sendUnauthorized(res, 'Your account has been deactivated');

  signTokenAndRespond(res, user, 200);
});

// ── Logout ────────────────────────────────────────────────────────────────────
/**
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  return sendSuccess(res, { message: 'Logged out successfully' });
});

// ── Get Current User ──────────────────────────────────────────────────────────
/**
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return sendSuccess(res, {
    message: 'User fetched successfully',
    data: { user },
  });
});

module.exports = { register, login, logout, getMe };
