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
    if (!req.body || typeof req.body !== 'object') return next();

    const isAuthEndpoint = req.originalUrl.includes('/auth/');
    const needsDecryption = /login|register|password/i.test(req.originalUrl);

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && isAuthEndpoint && needsDecryption) {
      req.body = processRequestBody(req.body);
      logger.debug(`Processed encrypted payload for ${req.method} ${req.originalUrl}`);
    }
    next();
  } catch (error) {
    logger.error('Error decrypting payload:', error);
    next();
  }
};

module.exports = decryptPayload; 