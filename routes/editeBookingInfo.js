const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Fetch booking info for a specific booking ID
router.get('/editBookingInfo/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
const userId ='HNG71';

  console.log('Fetching booking info for bookingId:', bookingId, 'and userId:', userId); // Debug log

  try {
    const companyPool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: userId,
      port: process.env.DB_PORT,
    });

    const [rows] = await companyPool.query('SELECT * FROM roombookinginfo WHERE BookingId = ?', [bookingId]);

    if (rows.length === 0) {
      console.log('No booking found for bookingId:', bookingId); // Debug log
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching booking info:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Update booking details
router.put('/editBookingInfo/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
  const userId ='HNG71';
  const {
    customerName,
    checkinDate,
    checkoutDate,
    customerId,
    roomNumber,
    extraBed,
    occupancy,
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
    segmentType,
    age,
    email,
    customerState,
    nationality,
    paymentType,
    advance
  } = req.body;

  console.log('Updating booking for bookingId:', bookingId, 'and userId:', userId); // Debug log

  try {
    const companyPool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: userId,
      port: process.env.DB_PORT,
    });

    const updateQuery = `
      UPDATE roombookinginfo
      SET customerName = ?, checkinDate = ?, checkoutDate = ?, customerId = ?, roomNumber = ?, extraBed = ?, occupancy = ?, amount = ?, amenities = ?, isAvailable = ?, exclusiveServices = ?, maleCount = ?, femaleCount = ?, childCount = ?, companyName = ?, companyAddress = ?, companyContact = ?, phoneNumber = ?, discount = ?, checkInTime = ?, idProofType = ?, idProofNumber = ?, idProofPath = ?, gst = ?, totalPrice = ?, segmentType = ?, age = ?, email = ?, customerState = ?, Nationality = ?, PaymentType = ?, Advance = ?
      WHERE BookingId = ?
    `;

    const [result] = await companyPool.query(updateQuery, [
      customerName,
      checkinDate,
      checkoutDate,
      customerId,
      roomNumber,
      extraBed,
      occupancy,
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
      segmentType,
      age,
      email,
      customerState,
      nationality,
      paymentType,
      advance,
      bookingId
    ]);

    if (result.affectedRows === 0) {
      console.log('No booking found to update for bookingId:', bookingId); // Debug log
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

module.exports = router;
