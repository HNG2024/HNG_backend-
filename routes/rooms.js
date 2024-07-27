const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

router.get('/rooms', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const companyName = userId;

    const companyPool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: companyName,
      port: process.env.DB_PORT,
    });

    const [results] = await companyPool.query('SELECT * FROM roominfo');

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching room data:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

module.exports = router;
