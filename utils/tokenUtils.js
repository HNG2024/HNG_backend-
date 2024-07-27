const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';

const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, secretKey, { expiresIn: '1h' });
};

const generateRefreshToken = (userId, role) => {
  return jwt.sign({ userId, role }, refreshTokenSecret, { expiresIn: '30d' });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};
