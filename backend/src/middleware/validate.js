const Joi = require('joi');
const httpStatus = require('http-status');
const { pick } = require('../utils/helpers');
const ApiError = require('../utils/ApiError');

/**
 * Middleware for validating request data against schema
 * @param {Object} schema - Joi validation schema
 * @returns {function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }

  // Replace request properties with validated values
  Object.assign(req, value);
  return next();
};

module.exports = validate; 