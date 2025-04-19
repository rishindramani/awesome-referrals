/**
 * Error utility module
 * This file re-exports the AppError class from errorHandler for backward compatibility
 */

const { AppError } = require('../middleware/errorHandler');

module.exports = {
  AppError
}; 