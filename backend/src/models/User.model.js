/**
 * src/models/User.model.js
 * User schema — matches the frontend User type in src/types/index.ts
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never return password in queries by default
    },
    avatar: {
      type: String,
      default: null,
    },
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },

    // Matches frontend user.stats shape
    stats: {
      totalStudyHours: { type: Number, default: 0 },
      quizzesTaken: { type: Number, default: 0 },
      flashcardsReviewed: { type: Number, default: 0 },
      documentsUploaded: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastStudiedAt: { type: Date, default: null },
    },

    // Matches frontend user.preferences shape
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      language: { type: String, default: 'en' },
      studyGoalHours: { type: Number, default: 2 },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        studyReminders: { type: Boolean, default: true },
        weeklyReport: { type: Boolean, default: true },
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// ── Pre-save hook: hash password ──────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare password ────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ── Instance method: return safe user object (no password) ───────────────────
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
