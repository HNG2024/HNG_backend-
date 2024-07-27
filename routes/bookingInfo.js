const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

router.get('/bookingInfo', async (req, res) => {
  const { userId, roomId} = req.query;

  try {
    const companyDatabase = userId;

    const companyPool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: companyDatabase,
      port: process.env.DB_PORT,
    });

    const query = `
      SELECT 
        customerName, 
        customerId, 
        checkinDate, 
        checkoutDate,
        BookingId
      FROM roombookinginfo 
      WHERE BookingId = ? 
      
    `;

    const [results] = await companyPool.query(query, [roomId]);

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(200).json({ message: 'No booking info available for today.' });
    }
  } catch (error) {
    console.error('Error fetching booking info:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

module.exports = router;
