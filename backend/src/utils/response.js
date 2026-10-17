/**
 * src/utils/response.js
 * Standardized API response helpers.
 * Every endpoint uses these to maintain a consistent JSON shape.
 *
 * Success shape:  { success: true,  message: "", data: {} }
 * Error shape:    { success: false, message: "", errors: [] }
 */

/**
 * Send a successful response.
 * @param {import('express').Response} res
 * @param {object} options
 * @param {string}  [options.message='Success']
 * @param {*}       [options.data=null]
 * @param {number}  [options.statusCode=200]
 */
const sendSuccess = (res, { message = 'Success', data = null, statusCode = 200 } = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send a created (201) response.
 */
const sendCreated = (res, { message = 'Created successfully', data = null } = {}) => {
  return sendSuccess(res, { message, data, statusCode: 201 });
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {object} options
 * @param {string}   [options.message='An error occurred']
 * @param {Array}    [options.errors=[]]
 * @param {number}   [options.statusCode=500]
 */
const sendError = (res, { message = 'An error occurred', errors = [], statusCode = 500 } = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Shorthand helpers for common HTTP error codes.
 */
const sendBadRequest = (res, message = 'Bad request', errors = []) =>
  sendError(res, { message, errors, statusCode: 400 });

const sendUnauthorized = (res, message = 'Unauthorized') =>
  sendError(res, { message, statusCode: 401 });

const sendForbidden = (res, message = 'Forbidden') =>
  sendError(res, { message, statusCode: 403 });

const sendNotFound = (res, message = 'Resource not found') =>
  sendError(res, { message, statusCode: 404 });

const sendConflict = (res, message = 'Conflict') =>
  sendError(res, { message, statusCode: 409 });

const sendServerError = (res, message = 'Internal server error') =>
  sendError(res, { message, statusCode: 500 });

module.exports = {
  sendSuccess,
  sendCreated,
  sendError,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendConflict,
  sendServerError,
};
