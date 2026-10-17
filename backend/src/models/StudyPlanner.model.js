/**
 * src/models/StudyPlanner.model.js
 * Study tasks, goals, and streak tracking — matches frontend StudyTask / WeeklyGoal types.
 */

const mongoose = require('mongoose');

// Individual task sub-schema
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 255 },
    description: { type: String, default: '', maxlength: 1000 },
    subject: { type: String, default: 'General', maxlength: 100 },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date, required: true },
    estimatedHours: { type: Number, default: 1, min: 0.25, max: 24 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    color: { type: String, default: '#6366f1' }, // hex color for UI
  },
  { timestamps: true }
);

const studyPlannerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one planner per user
      index: true,
    },
    tasks: [taskSchema],

    // Weekly study goal (hours)
    weeklyGoal: {
      targetHours: { type: Number, default: 10 },
      completedHours: { type: Number, default: 0 },
      weekStartDate: { type: Date, default: () => {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay()); // Sunday
        d.setHours(0, 0, 0, 0);
        return d;
      }},
    },

    // Streak data
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastStudiedDate: { type: String, default: null }, // YYYY-MM-DD
    },

    // Daily study log for heatmap/calendar { date: 'YYYY-MM-DD', hours: number, tasks: number }
    studyLog: [
      {
        date: { type: String, required: true },    // YYYY-MM-DD
        hours: { type: Number, default: 0 },
        tasks: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const StudyPlanner = mongoose.model('StudyPlanner', studyPlannerSchema);
module.exports = StudyPlanner;
