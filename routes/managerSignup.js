const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../db");

// Check if u_id is available
router.post('/checkUId', async (req, res) => {
  const { uId } = req.body;

  try {
    const query = 'SELECT * FROM HMSapp.LoginInfo WHERE u_id = ?';
    const [rows] = await pool.query(query, [uId]);

    if (rows.length > 0) {
      return res.json({ available: false });
    } else {
      return res.json({ available: true });
    }
  } catch (error) {
    console.error('Error checking u_id:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/managerSignup', async (req, res) => {
  const { uId, employeeName, password, companyName, age, phoneNumber, address, role } = req.body;

  if (role !== 'manager') {
    return res.status(400).json({ error: 'Only Admin can create a company database' });
  }

  try {
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert manager details into the main database (HMSapp)
    const insertMainDBQuery = `
      INSERT INTO HMSapp.LoginInfo (u_id, employeeName, Password, companyName, age, phoneNumber, address, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertMainDBQuery, [uId, employeeName, hashedPassword, companyName, age, phoneNumber, address, role]);
    console.log('Inserted manager into HMSapp.LoginInfo');

    // Create the company database
    const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS \`${uId}\``;
    await pool.query(createDatabaseQuery);
    console.log(`Created database ${uId}`);

    // Create the LoginInfo table in the new database
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS \`${uId}\`.LoginInfo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        u_id VARCHAR(50),
        employeeName VARCHAR(255),
        Password VARCHAR(255),
        companyName VARCHAR(100),
        age VARCHAR(50),
        phoneNumber VARCHAR(50),
        address VARCHAR(100),
        role VARCHAR(100)
      )
    `;
    await pool.query(createTableQuery);
    console.log(`Created table LoginInfo in database ${uId}`);

    // Insert the manager's information into the LoginInfo table of the new database
    const insertUserQuery = `
      INSERT INTO \`${uId}\`.LoginInfo (u_id, employeeName, Password, companyName, age, phoneNumber, address, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertUserQuery, [uId, employeeName, hashedPassword, companyName, age, phoneNumber, address, role]);
    console.log(`Inserted manager into ${uId}.LoginInfo`);

    res.status(201).json({ message: 'Manager signed up and company database created successfully' });
  } catch (error) {
    console.error('Error during manager signup:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
