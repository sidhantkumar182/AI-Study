/**
 * src/validators/chat.validator.js
 */

const { body, param } = require('express-validator');

const sendMessageValidator = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 5000 }).withMessage('Message cannot exceed 5000 characters'),
];

const createConversationValidator = [
  body('pdfId')
    .notEmpty().withMessage('PDF ID is required')
    .isMongoId().withMessage('Invalid PDF ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Title too long'),
];

const renameConversationValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title too long'),
];

const mongoIdParamValidator = (paramName = 'id') => [
  param(paramName)
    .isMongoId().withMessage(`Invalid ${paramName}`),
];

module.exports = {
  sendMessageValidator,
  createConversationValidator,
  renameConversationValidator,
  mongoIdParamValidator,
};
