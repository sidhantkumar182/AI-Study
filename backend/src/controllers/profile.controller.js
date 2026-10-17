/**
 * src/controllers/profile.controller.js
 *
 * GET    /api/profile         — Get profile
 * PUT    /api/profile         — Update profile (name, email, avatar, preferences)
 * PUT    /api/profile/password — Change password
 */

const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');
const { sendSuccess, sendBadRequest, sendUnauthorized, sendNotFound } = require('../utils/response');

// ── Get Profile ───────────────────────────────────────────────────────────────
/**
 * @route   GET /api/profile
 * @access  Private
 * Returns the full user object (no password).
 * Shape matches frontend user.preferences / user.stats
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return sendNotFound(res, 'User not found');

  return sendSuccess(res, {
    message: 'Profile fetched',
    data: { user },
  });
});

// ── Update Profile ────────────────────────────────────────────────────────────
/**
 * @route   PUT /api/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, avatar, preferences } = req.body;

  // Check email uniqueness if changing
  if (email && email !== req.user.email) {
    const taken = await User.findOne({ email });
    if (taken) return sendBadRequest(res, 'Email is already in use');
  }

  const updateFields = {};
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;
  if (avatar !== undefined) updateFields.avatar = avatar;

  // Merge nested preferences
  if (preferences) {
    const user = await User.findById(req.user._id);
    updateFields.preferences = {
      ...user.preferences.toObject(),
      ...preferences,
      notifications: {
        ...user.preferences.notifications.toObject(),
        ...(preferences.notifications || {}),
      },
    };
  }

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  return sendSuccess(res, {
    message: 'Profile updated successfully',
    data: { user: updated },
  });
});

// ── Change Password ───────────────────────────────────────────────────────────
/**
 * @route   PUT /api/profile/password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user) return sendNotFound(res, 'User not found');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return sendBadRequest(res, 'Current password is incorrect');

  user.password = newPassword;
  await user.save(); // triggers pre-save hash

  return sendSuccess(res, { message: 'Password changed successfully' });
});

module.exports = { getProfile, updateProfile, changePassword };
