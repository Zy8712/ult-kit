// lib/authUtils.js
import jwt from 'jsonwebtoken'; // npm install jsonwebtoken
import crypto from 'crypto'; // Built-in Node.js module

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d'; // Session duration

export function generateJwtToken(userId, email) {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwtToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Generate a secure random token for email verification
export function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Generate a shorter, more user-friendly code (e.g., 6 digits)
export function generateVerificationCode(length = 6) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}