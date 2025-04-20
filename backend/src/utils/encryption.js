const CryptoJS = require('crypto-js');
const logger = require('./logger');

// This should match the salt used on the frontend
const ENCRYPTION_SALT = 'awesome-referrals-public-salt';

/**
 * Determines if a string is likely to be encrypted
 * @param {string} text - Text to check
 * @returns {boolean} - Whether the text is likely encrypted
 */
const isEncrypted = (text) => {
  if (!text || typeof text !== 'string') return false;
  
  // Check for Base64 pattern used by CryptoJS
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  return text.length > 20 && base64Regex.test(text);
};

/**
 * Decrypts data that was encrypted on the client side
 * @param {string} encryptedText - The encrypted text
 * @returns {string} - The decrypted text, or the original if decryption fails
 */
const decryptData = (encryptedText) => {
  if (!encryptedText || !isEncrypted(encryptedText)) {
    return encryptedText;
  }
  
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_SALT);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    // The decrypted text should contain a nonce followed by the actual data
    const parts = decryptedText.split(':');
    if (parts.length >= 2) {
      // Return everything after the first colon
      return parts.slice(1).join(':');
    }
    
    return decryptedText;
  } catch (error) {
    logger.error('Decryption error:', error);
    // Return the original text if decryption fails
    return encryptedText;
  }
};

/**
 * Process request body to decrypt any encrypted fields
 * @param {Object} body - Request body object
 * @returns {Object} - Process body with decrypted values
 */
const processRequestBody = (body) => {
  if (!body || typeof body !== 'object') {
    return body;
  }
  
  const processedBody = { ...body };
  
  // Common sensitive fields to check
  const sensitiveFields = ['password', 'newPassword', 'oldPassword', 'currentPassword', 'confirm_password'];
  
  // Decrypt each sensitive field if present and encrypted
  sensitiveFields.forEach(field => {
    if (processedBody[field] && isEncrypted(processedBody[field])) {
      processedBody[field] = decryptData(processedBody[field]);
    }
  });
  
  return processedBody;
};

module.exports = {
  isEncrypted,
  decryptData,
  processRequestBody
}; 