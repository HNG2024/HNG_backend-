const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

router.post('/RoomBooking', async (req, res) => {
  const {
    userId,
    roomNumber,
    floor,
    customerId,
    extraBed,
    occupancy,
    checkinDate,
    checkoutDate,
    amount,
    amenities,
    isAvailable,
    exclusiveServices,
    maleCount,
    femaleCount,
    childCount,
    companyName,
    companyAddress,
    companyContact,
    phoneNumber,
    discount,
    checkInTime,
    idProofType,
    idProofNumber,
    idProofPath,
    gst,
    totalPrice,
    customerName,
    segmentType,
    age,
    email,
    customerState,
    nationality,
    paymentType,
    advance,
    FoodPlan
  } = req.body;

  try {
    const companyDatabase = userId;
    const companyPool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: companyDatabase,
      port: process.env.DB_PORT,
    });

    // Generate BookingId
    const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const BookingId = `${customerId}_${currentDate}`;

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS roombookinginfo (
        BookingId VARCHAR(255) NOT NULL,
        userId VARCHAR(255),
        roomNumber VARCHAR(255) NOT NULL,
        floor VARCHAR(50),
        customerId VARCHAR(255) PRIMARY KEY,
        extraBed VARCHAR(50),
        occupancy INT,
        checkinDate DATE,
        checkoutDate DATE,
        bookingDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        amount INT,
        amenities TEXT,
        isAvailable VARCHAR(255),
        exclusiveServices TEXT,
        maleCount INT,
        femaleCount INT,
        childCount INT,
        companyName VARCHAR(255),
        companyAddress VARCHAR(255),
        companyContact VARCHAR(255),
        phoneNumber VARCHAR(20),
        discount VARCHAR(100),
        checkInTime TIME,
        idProofType VARCHAR(100),
        idProofNumber VARCHAR(255),
        idProofPath VARCHAR(255),
        gst INT,
        totalPrice INT,
        customerName VARCHAR(255),
        segmentType VARCHAR(255),
        age INT,
        email VARCHAR(255),
        customerState VARCHAR(255),
        Nationality VARCHAR(255),
        PaymentType VARCHAR(255),
        Advance VARCHAR(255),
        FoodPlan VARCHAR(255)
      )
    `;
    await companyPool.query(createTableQuery);

    const insertQuery = `
      INSERT INTO roombookinginfo (
        BookingId, userId, roomNumber, floor, customerId, extraBed, occupancy, checkinDate, checkoutDate, amount, amenities, isAvailable, exclusiveServices, maleCount, femaleCount, childCount, companyName, companyAddress, companyContact, phoneNumber, discount, checkInTime, idProofType, idProofNumber, idProofPath, gst, totalPrice, customerName, segmentType, age, email, customerState, Nationality, PaymentType, Advance, FoodPlan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await companyPool.query(insertQuery, [
      BookingId,
      userId,
      roomNumber.join(', '), // Join room numbers into a string
      floor,
      customerId,
      extraBed,
      occupancy,
      checkinDate,
      checkoutDate,
      amount,
      amenities,
      isAvailable,
      exclusiveServices,
      maleCount,
      femaleCount,
      childCount,
      companyName,
      companyAddress,
      companyContact,
      phoneNumber,
      discount,
      checkInTime,
      idProofType,
      idProofNumber,
      idProofPath,
      gst,
      totalPrice,
      customerName,
      segmentType,
      age,
      email,
      customerState,
      nationality,
      paymentType,
      advance,
      FoodPlan
    ]);
    const updateQuery = `
    UPDATE roominfo
    SET available_room = 'no', BookingId = ?
    WHERE room_no IN (${roomNumber.map(() => '?').join(', ')})
  `;
  await companyPool.query(updateQuery, [BookingId, ...roomNumber]);

    res.status(201).json({ message: 'Room Booking successfully' });
  } catch (error) {
    console.error('Error Booking room data:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

module.exports = router;
