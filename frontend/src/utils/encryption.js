import CryptoJS from 'crypto-js';

// This salt should ideally be fetched from the server's public endpoint
// Using a static salt for demonstration purposes only
const ENCRYPTION_SALT = 'awesome-referrals-public-salt';

/**
 * Encrypts sensitive data like passwords before sending to the server
 * @param {string} plainText - The plain text to encrypt (like password)
 * @returns {string} - The encrypted string
 */
export const encryptSensitiveData = (plainText) => {
  if (!plainText) return '';
  
  // Add a unique nonce to prevent identical encryptions
  const nonce = CryptoJS.lib.WordArray.random(16).toString();
  const dataToEncrypt = `${nonce}:${plainText}`;
  
  return CryptoJS.AES.encrypt(dataToEncrypt, ENCRYPTION_SALT).toString();
};

/**
 * Checks if a string is encrypted
 * @param {string} text - Text to check
 * @returns {boolean} - Whether the text is encrypted
 */
export const isEncrypted = (text) => {
  if (!text || typeof text !== 'string') return false;
  
  try {
    const decrypted = CryptoJS.AES.decrypt(text, ENCRYPTION_SALT).toString(CryptoJS.enc.Utf8);
    return decrypted.includes(':');
  } catch (error) {
    return false;
  }
};

/**
 * Handles encryption of auth-related payloads (login, register)
 * @param {Object} payload - The payload object
 * @returns {Object} - The payload with sensitive data encrypted
 */
export const encryptAuthPayload = (payload) => {
  if (!payload) return payload;
  
  const encryptedPayload = { ...payload };
  
  // Encrypt password if present
  if (payload.password && !isEncrypted(payload.password)) {
    encryptedPayload.password = encryptSensitiveData(payload.password);
  }
  
  // Encrypt confirm password if present
  if (payload.confirm_password && !isEncrypted(payload.confirm_password)) {
    encryptedPayload.confirm_password = encryptSensitiveData(payload.confirm_password);
  }
  
  return encryptedPayload;
}; 