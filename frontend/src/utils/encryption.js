import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

const ENCRYPTION_SALT = 'awesome-referrals-public-salt';
let serverPublicKey = null;

export const setServerPublicKey = (key) => {
  serverPublicKey = key;
};

export const fetchServerPublicKey = async (baseUrl) => {
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/config/public-key`);
    if (res.status === 200) {
      const key = await res.text();
      if (key && key.includes('BEGIN PUBLIC KEY')) {
        serverPublicKey = key;
      }
    }
  } catch (_) {
    // ignore
  }
};

export const encryptSensitiveData = (plainText) => {
  if (!plainText) return '';

  // Prefer RSA if server public key available
  if (serverPublicKey) {
    const enc = new JSEncrypt();
    enc.setPublicKey(serverPublicKey);
    const encrypted = enc.encrypt(plainText);
    if (encrypted) return encrypted;
  }

  // Fallback to AES with nonce
  const nonce = CryptoJS.lib.WordArray.random(16).toString();
  const dataToEncrypt = `${nonce}:${plainText}`;
  return CryptoJS.AES.encrypt(dataToEncrypt, ENCRYPTION_SALT).toString();
};

export const isEncrypted = (text) => {
  if (!text || typeof text !== 'string') return false;
  // Basic heuristic for RSA (base64-like) or AES (base64)
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  return text.length > 20 && base64Regex.test(text);
};

export const encryptAuthPayload = (payload) => {
  if (!payload) return payload;
  const encryptedPayload = { ...payload };
  if (payload.password && !isEncrypted(payload.password)) {
    encryptedPayload.password = encryptSensitiveData(payload.password);
  }
  if (payload.confirm_password && !isEncrypted(payload.confirm_password)) {
    encryptedPayload.confirm_password = encryptSensitiveData(payload.confirm_password);
  }
  if (payload.newPassword && !isEncrypted(payload.newPassword)) {
    encryptedPayload.newPassword = encryptSensitiveData(payload.newPassword);
  }
  if (payload.oldPassword && !isEncrypted(payload.oldPassword)) {
    encryptedPayload.oldPassword = encryptSensitiveData(payload.oldPassword);
  }
  return encryptedPayload;
}; 