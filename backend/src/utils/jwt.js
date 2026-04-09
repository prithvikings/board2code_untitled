import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export const generateToken = (userId) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  };
  // Token expires in 7 days
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
