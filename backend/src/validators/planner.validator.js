/**
 * src/validators/planner.validator.js
 */

const { body, param } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title too long'),

  body('subject')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Subject too long'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),

  body('dueDate')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Invalid date format'),

  body('estimatedHours')
    .optional()
    .isFloat({ min: 0.25, max: 24 }).withMessage('Estimated hours must be 0.25-24'),

  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be a valid hex code'),
];

const updateTaskValidator = [
  body('title').optional().trim().isLength({ max: 255 }),
  body('completed').optional().isBoolean(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601(),
  body('estimatedHours').optional().isFloat({ min: 0.25, max: 24 }),
];

const updateGoalValidator = [
  body('targetHours')
    .notEmpty().withMessage('Target hours is required')
    .isFloat({ min: 0.5, max: 168 }).withMessage('Target hours must be between 0.5 and 168'),
];

module.exports = { createTaskValidator, updateTaskValidator, updateGoalValidator };
