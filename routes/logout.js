const express = require('express');
const router = express.Router();

const blacklistedTokens = new Set();

router.post('/logout', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }
  blacklistedTokens.add(token);
  res.status(200).json({ message: 'Logged out successfully' });
});

const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

module.exports = { router, isTokenBlacklisted };
