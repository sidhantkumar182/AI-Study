/**
 * src/middleware/validate.middleware.js
 * Runs express-validator results and returns errors if any.
 */

const { validationResult } = require('express-validator');

/**
 * Attach this after any express-validator chain.
 * Returns 400 with all validation errors if any exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }

  next();
};

module.exports = validate;
