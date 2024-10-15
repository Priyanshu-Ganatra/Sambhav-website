// lib/jwt.js
import jwt from 'jsonwebtoken';

// Function to encode data into JWT
const secretKey = process.env.JWT_SECRET_KEY;

export function encodeData(payload, options = {}) {
  return jwt.sign(payload, secretKey, options);
}

export function decodeData(token) {
    return new Promise((resolve) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          resolve({ status: 'error', error: err.message });
        } else {
          resolve({ status: 'success', decoded });
        }
      });
    });
  }