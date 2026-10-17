/**
 * src/controllers/planner.controller.js
 *
 * GET    /api/planner               — Get planner (tasks + streak + goal)
 * POST   /api/planner/task          — Create task
 * PUT    /api/planner/task/:taskId  — Update task
 * DELETE /api/planner/task/:taskId  — Delete task
 * PUT    /api/planner/goal          — Update weekly goal
 * POST   /api/planner/log           — Log study session (updates streak + hours)
 */

const asyncHandler = require('express-async-handler');
const StudyPlanner = require('../models/StudyPlanner.model');
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require('../utils/response');

// ── Helper: get or create planner for user ────────────────────────────────────
const getOrCreatePlanner = async (userId) => {
  let planner = await StudyPlanner.findOne({ user: userId });
  if (!planner) planner = await StudyPlanner.create({ user: userId });
  return planner;
};

// ── Get Planner ────────────────────────────────────────────────────────────────
/**
 * @route   GET /api/planner
 * @access  Private
 * Returns the full planner — tasks, streak, weekly goal, study log.
 * Shape matches frontend StudyTask[], WeeklyGoal, StudyStreak types.
 */
const getPlanner = asyncHandler(async (req, res) => {
  const planner = await getOrCreatePlanner(req.user._id);
  return sendSuccess(res, {
    message: 'Planner fetched',
    data: { planner: formatPlanner(planner) },
  });
});

// ── Create Task ───────────────────────────────────────────────────────────────
/** @route POST /api/planner/task */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, subject, priority, dueDate, estimatedHours, color } = req.body;
  const planner = await getOrCreatePlanner(req.user._id);

  planner.tasks.push({ title, description, subject, priority, dueDate, estimatedHours, color });
  await planner.save();

  const newTask = planner.tasks[planner.tasks.length - 1];
  return sendCreated(res, {
    message: 'Task created',
    data: { task: formatTask(newTask) },
  });
});

// ── Update Task ───────────────────────────────────────────────────────────────
/** @route PUT /api/planner/task/:taskId */
const updateTask = asyncHandler(async (req, res) => {
  const planner = await StudyPlanner.findOne({ user: req.user._id });
  if (!planner) return sendNotFound(res, 'Planner not found');

  const task = planner.tasks.id(req.params.taskId);
  if (!task) return sendNotFound(res, 'Task not found');

  const { title, description, subject, priority, dueDate, estimatedHours, color, completed } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (subject !== undefined) task.subject = subject;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (estimatedHours !== undefined) task.estimatedHours = estimatedHours;
  if (color !== undefined) task.color = color;
  if (completed !== undefined) {
    task.completed = completed;
    task.completedAt = completed ? new Date() : null;
  }

  await planner.save();
  return sendSuccess(res, {
    message: 'Task updated',
    data: { task: formatTask(task) },
  });
});

// ── Delete Task ───────────────────────────────────────────────────────────────
/** @route DELETE /api/planner/task/:taskId */
const deleteTask = asyncHandler(async (req, res) => {
  const planner = await StudyPlanner.findOne({ user: req.user._id });
  if (!planner) return sendNotFound(res, 'Planner not found');

  const task = planner.tasks.id(req.params.taskId);
  if (!task) return sendNotFound(res, 'Task not found');

  planner.tasks.pull(task._id);
  await planner.save();
  return sendSuccess(res, { message: 'Task deleted' });
});

// ── Update Weekly Goal ─────────────────────────────────────────────────────────
/** @route PUT /api/planner/goal */
const updateGoal = asyncHandler(async (req, res) => {
  const { targetHours } = req.body;
  const planner = await getOrCreatePlanner(req.user._id);

  planner.weeklyGoal.targetHours = targetHours;
  await planner.save();

  return sendSuccess(res, {
    message: 'Weekly goal updated',
    data: { weeklyGoal: planner.weeklyGoal },
  });
});

// ── Log Study Session ─────────────────────────────────────────────────────────
/**
 * @route   POST /api/planner/log
 * @body    { hours: number, date?: 'YYYY-MM-DD' }
 * Updates weekly completed hours, streak, and daily log.
 */
const logStudySession = asyncHandler(async (req, res) => {
  const { hours, date } = req.body;
  if (!hours || hours <= 0) return sendBadRequest(res, 'Hours must be positive');

  const today = date || new Date().toISOString().split('T')[0];
  const planner = await getOrCreatePlanner(req.user._id);

  // Update weekly goal progress
  planner.weeklyGoal.completedHours = (planner.weeklyGoal.completedHours || 0) + hours;

  // Update daily log
  const existing = planner.studyLog.find(l => l.date === today);
  if (existing) {
    existing.hours += hours;
    existing.tasks += 1;
  } else {
    planner.studyLog.push({ date: today, hours, tasks: 1 });
  }

  // Update streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split('T')[0];
  if (!planner.streak.lastStudiedDate || planner.streak.lastStudiedDate === yStr) {
    planner.streak.current = (planner.streak.current || 0) + (planner.streak.lastStudiedDate === today ? 0 : 1);
  } else if (planner.streak.lastStudiedDate !== today) {
    planner.streak.current = 1;
  }
  planner.streak.longest = Math.max(planner.streak.longest || 0, planner.streak.current);
  planner.streak.lastStudiedDate = today;

  await planner.save();
  return sendSuccess(res, {
    message: 'Study session logged',
    data: { streak: planner.streak, weeklyGoal: planner.weeklyGoal },
  });
});

// ── Format helpers ─────────────────────────────────────────────────────────────
const formatTask = (task) => ({
  id: task._id.toString(),
  title: task.title,
  description: task.description,
  subject: task.subject,
  priority: task.priority,
  dueDate: task.dueDate,
  estimatedHours: task.estimatedHours,
  completed: task.completed,
  completedAt: task.completedAt,
  color: task.color,
  createdAt: task.createdAt,
});

const formatPlanner = (planner) => ({
  tasks: planner.tasks.map(formatTask),
  weeklyGoal: planner.weeklyGoal,
  streak: {
    current: planner.streak.current,
    longest: planner.streak.longest,
    lastStudiedDate: planner.streak.lastStudiedDate,
    weeklyData: planner.studyLog.slice(-7).map(l => ({
      day: new Date(l.date).toLocaleDateString('en-US', { weekday: 'short' }),
      hours: l.hours,
    })),
  },
  studyLog: planner.studyLog,
});

module.exports = { getPlanner, createTask, updateTask, deleteTask, updateGoal, logStudySession };
