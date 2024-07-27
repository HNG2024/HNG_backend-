// routes/addRoom.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

router.post('/addRoom', async (req, res) => {
  const {
    userId,
    roomNumber,
    floor,
    roomType,
    viewType,
    bedType,
    maxOccupancy,
    roomSize,
    pricePerNight,
    amenities,
    exclusiveServices,
    isAvailable,
  } = req.body;

  console.log('Received userId:', userId);

  try {
    const companyName = userId;

    console.log('Connecting to database:', companyName);

    const companyPool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: companyName,
      port: process.env.DB_PORT,
    });

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS roominfo (
        room_id VARCHAR(255) PRIMARY KEY,
        room_no VARCHAR(50) NOT NULL,
        floor_no INT NOT NULL,
        room_type VARCHAR(150) NOT NULL,
        view_type VARCHAR(250) NOT NULL,
        bed_type VARCHAR(100) NOT NULL,
        max_occupancy INT NOT NULL,
        room_size INT NOT NULL,
        price_pernight INT NOT NULL,
        amenities_room VARCHAR(200),
        exclusive_services VARCHAR(100),
        available_room VARCHAR(100),
        checking_room VARCHAR(200),
        CurrentBookingId VARCHAR(255) NULL
      )
    `;
    await companyPool.query(createTableQuery);

    const roomId = `${userId}_${roomNumber}`;
    const query = `
      INSERT INTO roominfo (room_id, room_no, floor_no, room_type, view_type, bed_type, max_occupancy, room_size, price_pernight, amenities_room, exclusive_services, available_room, checking_room)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'no')
    `;
    await companyPool.query(query, [
      roomId,
      roomNumber,
      floor,
      roomType,
      viewType,
      bedType,
      maxOccupancy,
      roomSize,
      pricePerNight,
      amenities,
      exclusiveServices,
      isAvailable ? 'yes' : 'no',
    ]);

    res.status(201).json({
      message: 'Room added successfully',
      roomId
    });
  } catch (error) {
    console.error('Error inserting room data:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

module.exports = router;
