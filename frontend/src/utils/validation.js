/**
 * Validation utility functions for form fields
 * @module validation
 */

/**
 * Checks if a value is empty (null, undefined, empty string, or empty array)
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Validates an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if the email is valid
 */
export const isValidEmail = (email) => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

/**
 * Validates if value is a number
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is a number
 */
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validates minimum length of a string
 * @param {string} value - The string to check
 * @param {number} minLength - The minimum length required
 * @returns {boolean} - True if the string meets the minimum length
 */
export const minLength = (value, minLength) => {
  return value.length >= minLength;
};

/**
 * Validates maximum length of a string
 * @param {string} value - The string to check
 * @param {number} maxLength - The maximum length allowed
 * @returns {boolean} - True if the string is within the maximum length
 */
export const maxLength = (value, maxLength) => {
  return value.length <= maxLength;
};

/**
 * Validates if a value is a URL
 * @param {string} value - The URL to validate
 * @returns {boolean} - True if the value is a valid URL
 */
export const isUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validates a password meets requirements
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * - Contains at least one special character
 * @param {string} password - The password to validate
 * @returns {boolean} - True if the password is valid
 */
export const isStrongPassword = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumbers &&
    hasSpecialChar
  );
};

/**
 * Validates if two values match (e.g., password confirmation)
 * @param {*} value1 - First value
 * @param {*} value2 - Second value to compare
 * @returns {boolean} - True if the values match
 */
export const valuesMatch = (value1, value2) => {
  return value1 === value2;
};

/**
 * Creates a validation rule object for use with forms
 * @param {Function} validator - Validation function that returns true/false
 * @param {string} message - Error message to display if validation fails
 * @returns {Object} - Validation rule object
 */
export const createRule = (validator, message) => {
  return { validator, message };
};

/**
 * Creates validation rules for a login form
 * @returns {Object} - Validation rules for email and password
 */
export const loginValidation = {
  email: [
    createRule(value => !isEmpty(value), 'Email is required'),
    createRule(value => isValidEmail(value), 'Please enter a valid email address')
  ],
  password: [
    createRule(value => !isEmpty(value), 'Password is required')
  ]
};

/**
 * Creates validation rules for a registration form
 * @returns {Object} - Validation rules for registration form fields
 */
export const registrationValidation = {
  first_name: [
    createRule(value => !isEmpty(value), 'First name is required'),
    createRule(value => minLength(value, 2), 'First name must be at least 2 characters')
  ],
  last_name: [
    createRule(value => !isEmpty(value), 'Last name is required'),
    createRule(value => minLength(value, 2), 'Last name must be at least 2 characters')
  ],
  email: [
    createRule(value => !isEmpty(value), 'Email is required'),
    createRule(value => isValidEmail(value), 'Please enter a valid email address')
  ],
  password: [
    createRule(value => !isEmpty(value), 'Password is required'),
    createRule(value => minLength(value, 8), 'Password must be at least 8 characters'),
    createRule(value => isStrongPassword(value), 'Password must include uppercase, lowercase, number, and special character')
  ],
  confirm_password: [
    createRule(value => !isEmpty(value), 'Please confirm your password'),
    createRule((value, values) => valuesMatch(value, values.password), 'Passwords do not match')
  ]
};

/**
 * Creates validation rules for a profile form
 * @returns {Object} - Validation rules for profile form fields
 */
export const profileValidation = {
  first_name: [
    createRule(value => !isEmpty(value), 'First name is required')
  ],
  last_name: [
    createRule(value => !isEmpty(value), 'Last name is required')
  ],
  email: [
    createRule(value => !isEmpty(value), 'Email is required'),
    createRule(value => isValidEmail(value), 'Please enter a valid email address')
  ],
  linkedin_url: [
    createRule(value => isEmpty(value) || isUrl(value), 'Please enter a valid URL')
  ]
};

/**
 * Validates a form based on the specified rules
 * @param {Object} values - Form values to validate
 * @param {Object} rules - Validation rules to apply
 * @returns {Object} - Validation errors object
 */
export const validateForm = (values, rules) => {
  const errors = {};

  // Process each field in the rules
  Object.entries(rules).forEach(([fieldName, fieldRules]) => {
    // Get the field value (or empty string if undefined)
    const value = values[fieldName] || '';
    
    // Check each rule for the field
    for (const rule of fieldRules) {
      if (!rule.validator(value, values)) {
        errors[fieldName] = rule.message;
        break; // Stop on first error for this field
      }
    }
  });

  return errors;
};

export default {
  isEmpty,
  isValidEmail,
  isNumber,
  minLength,
  maxLength,
  isUrl,
  isStrongPassword,
  valuesMatch,
  createRule,
  validateForm,
  loginValidation,
  registrationValidation,
  profileValidation
}; 