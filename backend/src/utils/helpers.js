/**
 * Create a subset of an object with only the specified keys
 * @param {Object} object - Source object
 * @param {Array} keys - Keys to pick
 * @returns {Object} New object with only picked keys
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

/**
 * Format a date to ISO string without milliseconds
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
const generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Convert pagination parameters to Sequelize options
 * @param {Object} options - Pagination options
 * @returns {Object} Sequelize pagination options
 */
const toPaginationOptions = (options) => {
  const { page = 1, limit = 10, sort } = options;
  const offset = (page - 1) * limit;
  
  const paginationOptions = {
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
  };
  
  if (sort) {
    const [sortField, sortOrder] = sort.split(':');
    paginationOptions.order = [[sortField, sortOrder === 'desc' ? 'DESC' : 'ASC']];
  }
  
  return paginationOptions;
};

module.exports = {
  pick,
  formatDate,
  generateRandomString,
  toPaginationOptions,
}; 