/**
 * src/models/Analytics.model.js
 * Aggregated analytics per user — matches the frontend analytics mock shape.
 */

const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },

    // Dashboard summary stats — matches mockDashboardStats shape
    dashboard: {
      totalStudyHours: { type: Number, default: 0 },
      totalDocuments: { type: Number, default: 0 },
      totalFlashcards: { type: Number, default: 0 },
      totalQuizzesTaken: { type: Number, default: 0 },
      quizAccuracy: { type: Number, default: 0 },     // average %
      averageDailyHours: { type: Number, default: 0 },
      topicsCompleted: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
    },

    // Daily study hours over time — [ { date: 'YYYY-MM-DD', value: number } ]
    studyHours: [
      {
        date: { type: String },
        value: { type: Number, default: 0 },
      },
    ],

    // Quiz accuracy over time — [ { date: 'YYYY-MM-DD', value: number } ]
    quizAccuracy: [
      {
        date: { type: String },
        value: { type: Number, default: 0 },
      },
    ],

    // Weekly performance — [ { week: 'Week 1', studyHours, quizScore, flashcardsReviewed } ]
    weeklyPerformance: [
      {
        week: String,
        studyHours: { type: Number, default: 0 },
        quizScore: { type: Number, default: 0 },
        flashcardsReviewed: { type: Number, default: 0 },
      },
    ],

    // Subject distribution — [ { name: 'Math', value: 35, color: '#6366f1' } ]
    subjectDistribution: [
      {
        name: String,
        value: { type: Number, default: 0 },
        color: { type: String, default: '#6366f1' },
      },
    ],

    // Topics progress — [ { topic, completed, total, percentage } ]
    topicsCompleted: [
      {
        topic: String,
        completed: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 },
      },
    ],

    // Heatmap data — [ { date: 'YYYY-MM-DD', count: 0-4 } ]
    heatmap: [
      {
        date: { type: String },
        count: { type: Number, default: 0, min: 0, max: 4 },
      },
    ],

    // Recent activity feed — [ { type, description, timestamp, icon } ]
    recentActivity: [
      {
        type: { type: String },
        description: { type: String },
        timestamp: { type: Date, default: Date.now },
        icon: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;
