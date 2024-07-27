const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';
const adminAccessKey = process.env.ADMIN_ACCESS_KEY || 'your-admin-access-key'; // Ensure this is set in your .env file

router.post('/adminLogin', (req, res) => {
  const { name, uId, AdminaccessKey, password } = req.body;

  // Check if the admin access key is correct
  if (AdminaccessKey !== adminAccessKey) {
    return res.status(401).json({ error: 'Invalid admin access key' });
  }

  const query = 'SELECT * FROM adminlogin WHERE employeeName = ? AND u_id = ?';

  pool.query(query, [name, uId], async (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.Password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user.id, role: user.role }, refreshTokenSecret, { expiresIn: '30d' });

    res.status(200).json({ message: 'Login successful', accessToken, refreshToken, role: user.role });
  });
});

module.exports = router;
