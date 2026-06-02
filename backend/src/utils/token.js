import crypto from 'crypto';
import jwt from 'jsonwebtoken';

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido');
  }
  return process.env.JWT_SECRET;
}

export function signSessionToken(payload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
}

export function verifySessionToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
