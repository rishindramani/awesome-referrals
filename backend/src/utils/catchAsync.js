/**
 * Wrap async functions to handle errors without try/catch blocks
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function with error handling
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync; 