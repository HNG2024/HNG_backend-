const express = require('express');
const PDFDocument = require('pdfkit');
const mysql = require('mysql2/promise');

const router = express.Router();

let db;

(async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'HNG71',
      port: process.env.DB_PORT,
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();

router.get('/bills', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM roombookinginfo');
    res.json(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/generate-bill/:customerId', async (req, res) => {
  const { customerId } = req.params;

  try {
    const [results] = await db.query('SELECT * FROM roombookinginfo WHERE customerId = ?', [customerId]);
    if (results.length > 0) {
      const billData = results[0];
      const doc = new PDFDocument({ margin: 30 });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=bill_${customerId}.pdf`);

      doc.pipe(res);

      // Generate the PDF content
      doc.fillColor('#4B0082').fontSize(20).text('Hotel Chenduran Park', { align: 'center' });
      doc.fontSize(12).text('Old R.M.S Road, Near Railway Station', { align: 'center' });
      doc.fontSize(12).text('Nagercoil, Tamil Nadu 629001', { align: 'center' });
      doc.fontSize(12).text('GSTIN: 33AALC5759Q1ZD', { align: 'center' });
      doc.moveDown();
      doc.fillColor('#000').fontSize(18).text('Bill', { align: 'center' });
      doc.moveDown();

      // Customer and room details
      doc.fontSize(14).fillColor('#4B0082').text('Customer Name: ', { continued: true }).fillColor('#000').text(billData.customerName);
      doc.fillColor('#4B0082').text('Room Number: ', { continued: true }).fillColor('#000').text(billData.roomNumber);
      doc.fillColor('#4B0082').text('Check-in Date: ', { continued: true }).fillColor('#000').text(new Date(billData.checkinDate).toLocaleString());
      doc.fillColor('#4B0082').text('Check-out Date: ', { continued: true }).fillColor('#000').text(new Date(billData.checkoutDate).toLocaleString());
      doc.fillColor('#4B0082').text('Total Price: ', { continued: true }).fillColor('#000').text(billData.totalPrice);
      doc.fillColor('#4B0082').text('Amount: ', { continued: true }).fillColor('#000').text(billData.amount);
      doc.fillColor('#4B0082').text('Discount: ', { continued: true }).fillColor('#000').text(billData.discount);
      doc.fillColor('#4B0082').text('GST: ', { continued: true }).fillColor('#000').text(billData.gst);

      doc.moveDown();

      // Table header
      doc.fillColor('#4B0082').fontSize(14).text('S.No', { continued: true, underline: true });
      doc.text(' Description', { continued: true, underline: true, align: 'left' });
      doc.text(' Amount', { underline: true, align: 'right' });

      // Table rows
      doc.fillColor('#000').fontSize(12).text('1', { continued: true });
      doc.text(' Room Rent', { continued: true, align: 'left' });
      doc.text(` ${billData.amount}`, { align: 'right' });

      // Additional rows can be added here...

      doc.moveDown();

      // Total amount
      doc.fillColor('#4B0082').fontSize(14).text('Total Amount:', { continued: true });
      doc.fillColor('#000').text(` ${billData.totalPrice}`, { align: 'right' });

      doc.moveDown();

      // Footer with stamp and signature
      doc.fillColor('#4B0082').fontSize(12).text('Authorized Signatory', { align: 'left' });
      doc.text('Customer Signature', { align: 'right' });

      doc.moveDown(3);

      // Powered by HealNGlow
      doc.fontSize(10).fillColor('#aaa').text('Powered by HealNGlow', { align: 'right' });

      doc.end();
    } else {
      res.status(404).send('Customer not found');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
