/**
 * src/routes/planner.routes.js
 */

const express = require('express');
const router = express.Router();
const {
  getPlanner, createTask, updateTask,
  deleteTask, updateGoal, logStudySession,
} = require('../controllers/planner.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createTaskValidator, updateTaskValidator, updateGoalValidator } = require('../validators/planner.validator');

router.use(protect);

router.get('/',                    getPlanner);
router.post('/task',               createTaskValidator, validate, createTask);
router.put('/task/:taskId',        updateTaskValidator, validate, updateTask);
router.delete('/task/:taskId',     deleteTask);
router.put('/goal',                updateGoalValidator, validate, updateGoal);
router.post('/log',                logStudySession);

module.exports = router;
