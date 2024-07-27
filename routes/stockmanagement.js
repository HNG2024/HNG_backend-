const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'HNG71',
  port: 3306
});

db.connect(err => {
  if (err) throw err;
});

// Get all products
router.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get all categories
router.get('/categories', (req, res) => {
  const sql = 'SELECT * FROM product_categories';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new product
router.post('/products', (req, res) => {
  const { name, quantity, unit, category_id, purchase_price } = req.body;
  const sql = 'INSERT INTO products (name, quantity, unit, category_id, purchase_price) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, quantity, unit, category_id, purchase_price], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId });
  });
});

// Update a product
router.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, quantity, unit, category_id, purchase_price } = req.body;
  const sql = 'UPDATE products SET name = ?, quantity = ?, unit = ?, category_id = ?, purchase_price = ? WHERE id = ?';
  db.query(sql, [name, quantity, unit, category_id, purchase_price, id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Delete a product
router.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Get stock summary
router.get('/stock-summary', (req, res) => {
  const sql = `
    SELECT p.id, p.name, p.quantity AS stock_quantity, p.unit, 
           c.name AS category_name, 
           (p.quantity * p.purchase_price) AS stock_value 
    FROM products p
    JOIN product_categories c ON p.category_id = c.id
  `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

module.exports = router;
