const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();
const pool = require('../db'); // Ensure this points to your db.js file

router.post('/checkRoomNumber', async (req, res) => {
  const { userId, roomNumber } = req.body;

  try {
    const [userResults] = await pool.query('SELECT companyName FROM LoginInfo WHERE u_id = ?', [userId]);

    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const companyName = userResults[0].companyName;

    const companyPool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: companyName,
      port: process.env.DB_PORT
    });

    const [roomResults] = await companyPool.query('SELECT * FROM roominfo WHERE room_no = ?', [roomNumber]);

    if (roomResults.length > 0) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking room number:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

module.exports = router;
