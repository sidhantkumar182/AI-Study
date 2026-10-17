/**
 * src/controllers/analytics.controller.js
 *
 * GET  /api/analytics/dashboard  — Dashboard stats (matches mockDashboardStats)
 * GET  /api/analytics/overview   — Full analytics data (charts, heatmap, etc.)
 * POST /api/analytics/activity   — Log a new activity event
 */

const asyncHandler = require('express-async-handler');
const Analytics = require('../models/Analytics.model');
const PDF = require('../models/PDF.model');
const Quiz = require('../models/Quiz.model');
const Flashcard = require('../models/Flashcard.model');
const User = require('../models/User.model');
const { sendSuccess } = require('../utils/response');

// ── Helper: build up-to-date analytics from DB ────────────────────────────────
const buildDashboardStats = async (userId) => {
  const [user, pdfCount, quizzes, flashcardDecks] = await Promise.all([
    User.findById(userId),
    PDF.countDocuments({ user: userId, status: 'ready' }),
    Quiz.find({ user: userId }).select('bestScore attempts'),
    Flashcard.find({ user: userId }).select('totalCards masteredCards'),
  ]);

  const totalFlashcards = flashcardDecks.reduce((s, d) => s + (d.totalCards || 0), 0);
  const avgQuizScore = quizzes.length
    ? Math.round(quizzes.reduce((s, q) => s + q.bestScore, 0) / quizzes.length)
    : 0;

  return {
    totalStudyHours: user?.stats?.totalStudyHours || 0,
    totalDocuments: pdfCount,
    totalFlashcards,
    totalQuizzesTaken: quizzes.length,
    quizAccuracy: avgQuizScore,
    averageDailyHours: parseFloat((user?.stats?.totalStudyHours / 30 || 0).toFixed(1)),
    topicsCompleted: pdfCount, // one topic per document as a proxy
    currentStreak: user?.stats?.currentStreak || 0,
  };
};

// ── Dashboard Stats ───────────────────────────────────────────────────────────
/**
 * @route   GET /api/analytics/dashboard
 * @access  Private
 * Returns: matches frontend mockDashboardStats shape exactly.
 */
const getDashboard = asyncHandler(async (req, res) => {
  const stats = await buildDashboardStats(req.user._id);
  return sendSuccess(res, {
    message: 'Dashboard stats fetched',
    data: { stats },
  });
});

// ── Full Analytics ─────────────────────────────────────────────────────────────
/**
 * @route   GET /api/analytics/overview
 * @access  Private
 * Returns full analytics object matching frontend mockAnalytics shape.
 */
const getOverview = asyncHandler(async (req, res) => {
  let analytics = await Analytics.findOne({ user: req.user._id });
  if (!analytics) {
    analytics = await Analytics.create({ user: req.user._id });
  }

  // Merge live dashboard stats into the stored analytics
  const dashboardStats = await buildDashboardStats(req.user._id);

  return sendSuccess(res, {
    message: 'Analytics fetched',
    data: {
      dashboard: dashboardStats,
      studyHours: analytics.studyHours,
      quizAccuracy: analytics.quizAccuracy,
      weeklyPerformance: analytics.weeklyPerformance,
      subjectDistribution: analytics.subjectDistribution,
      topicsCompleted: analytics.topicsCompleted,
      heatmap: analytics.heatmap,
      recentActivity: analytics.recentActivity.slice(0, 20),
    },
  });
});

// ── Log Activity ───────────────────────────────────────────────────────────────
/**
 * @route   POST /api/analytics/activity
 * @body    { type, description, icon }
 * Adds a new activity event to the recent activity feed.
 */
const logActivity = asyncHandler(async (req, res) => {
  const { type, description, icon = '📚' } = req.body;

  let analytics = await Analytics.findOne({ user: req.user._id });
  if (!analytics) analytics = await Analytics.create({ user: req.user._id });

  // Prepend to keep recent first, keep max 100
  analytics.recentActivity.unshift({ type, description, icon, timestamp: new Date() });
  if (analytics.recentActivity.length > 100) analytics.recentActivity.pop();

  await analytics.save();
  return sendSuccess(res, { message: 'Activity logged' });
});

module.exports = { getDashboard, getOverview, logActivity };
