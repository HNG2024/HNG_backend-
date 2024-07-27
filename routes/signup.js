const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../db'); // Ensure correct path to your db.js file

router.post('/signup', async (req, res) => {
  const { uId, employeeName, password, companyName, age, phoneNumber, address, role } = req.body;

  try {
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure the LoginInfo table exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS LoginInfo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employeeName VARCHAR(255),
        Password VARCHAR(500),
        u_id VARCHAR(100) NOT NULL,
        companyName VARCHAR(100),
        age VARCHAR(50),
        phoneNumber VARCHAR(50),
        address VARCHAR(100),
        role VARCHAR(500)
      )`;

    await pool.query(createTableQuery);

    // Insert the new user into the LoginInfo table
    const insertQuery = 'INSERT INTO LoginInfo (u_id, employeeName, Password, companyName, age, phoneNumber, address, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    await pool.query(insertQuery, [uId, employeeName, hashedPassword, companyName, age, phoneNumber, address, role]);

    res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
