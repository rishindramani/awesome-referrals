const { processRequestBody } = require('../utils/encryption');
const logger = require('../utils/logger');

/**
 * Middleware to decrypt sensitive fields in request body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const decryptPayload = (req, res, next) => {
  try {
    // Only process if there's a body and it's a POST or PUT/PATCH request
    // AND the route is related to authentication (contains /auth/ and involves passwords)
    if (req.body && 
        ['POST', 'PUT', 'PATCH'].includes(req.method) && 
        req.originalUrl.includes('/auth/') &&
        (req.originalUrl.includes('/login') || 
         req.originalUrl.includes('/register') || 
         req.originalUrl.includes('/password'))) {
      
      // Process the request body to decrypt any encrypted fields
      req.body = processRequestBody(req.body);
      
      // Log that decryption was processed (but don't log the actual body for security)
      logger.debug(`Processed encrypted payload for ${req.method} ${req.originalUrl}`);
    }
    next();
  } catch (error) {
    logger.error('Error decrypting payload:', error);
    // Continue even if decryption fails to maintain compatibility with unencrypted requests
    next();
  }
};

module.exports = decryptPayload; 