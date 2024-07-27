const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const router = express.Router();

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';
const adminAccessKey = process.env.ADMIN_ACCESS_KEY || 'your-admin-access-key'; // Ensure this is set in your .env file

router.post('/adminLogin', async (req, res) => {
  const { name, uId, AdminaccessKey, password } = req.body;

  // Check if the admin access key is correct
  if (AdminaccessKey !== adminAccessKey) {
    return res.status(401).json({ error: 'Invalid admin access key' });
  }

  try {
    // Create a pool for the main database
    const pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    // Query to find the admin user by name and uId in the main database
    const [results] = await pool.query('SELECT * FROM adminlogin WHERE employeeName = ? AND u_id = ?', [name, uId]);

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
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
