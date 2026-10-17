/**
 * src/validators/quiz.validator.js
 */

const { body, param } = require('express-validator');

const generateQuizValidator = [
  body('pdfId')
    .notEmpty().withMessage('PDF ID is required')
    .isMongoId().withMessage('Invalid PDF ID'),

  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),

  body('questionCount')
    .optional()
    .isInt({ min: 3, max: 30 }).withMessage('Question count must be between 3 and 30'),
];

const submitQuizValidator = [
  body('answers')
    .isArray({ min: 1 }).withMessage('Answers must be a non-empty array'),

  body('answers.*.questionId')
    .notEmpty().withMessage('Question ID is required for each answer'),

  body('answers.*.selectedAnswer')
    .isInt({ min: 0, max: 3 }).withMessage('Selected answer must be 0-3'),

  body('timeTakenSeconds')
    .optional()
    .isInt({ min: 0 }).withMessage('Time taken must be a positive number'),
];

module.exports = { generateQuizValidator, submitQuizValidator };
