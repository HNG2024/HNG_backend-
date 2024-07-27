const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post('/checkUId', async (req, res) => {
  const { uId } = req.body;

  try {
    const query = 'SELECT * FROM LoginInfo WHERE u_id = ?';
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

module.exports = router;
