const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');

const router = express.Router();

// Database setup (using Sequelize)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false, // Disable logging
});

const File = sequelize.define('File', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  timestamps: false,
});

// Sync the model with the database
sequelize.sync().then(() => {
  console.log('Database synced successfully');
}).catch((error) => {
  console.error('Error syncing database:', error);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  console.log('File upload request received:', req.file);
  try {
    const { originalname, size } = req.file;
    await File.create({ name: originalname, size });
    res.status(200).send({ message: 'File uploaded successfully', file: req.file });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send({ message: 'Error uploading file', error });
  }
});

router.get('/files', async (req, res) => {
  try {
    const files = await File.findAll();
    res.status(200).send(files);
  } catch (error) {
    console.error('Unable to fetch files:', error);
    res.status(500).send({ message: 'Unable to fetch files', error });
  }
});

router.delete('/files/:name', async (req, res) => {
  const fileName = req.params.name;
  const filePath = path.join(__dirname, '../uploads', fileName);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await File.destroy({ where: { name: fileName } });
    res.status(200).send({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Unable to delete file:', error);
    res.status(500).send({ message: 'Unable to delete file', error });
  }
});

router.put('/files/:name', async (req, res) => {
  const oldName = req.params.name;
  const newName = req.body.newName;
  const oldPath = path.join(__dirname, '../uploads', oldName);
  const newPath = path.join(__dirname, '../uploads', newName);
  try {
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
    }
    await File.update({ name: newName }, { where: { name: oldName } });
    res.status(200).send({ message: 'File renamed successfully' });
  } catch (error) {
    console.error('Unable to rename file:', error);
    res.status(500).send({ message: 'Unable to rename file', error });
  }
});

router.get('/uploads/:name', (req, res) => {
  const fileName = req.params.name;
  const filePath = path.join(__dirname, '../uploads', fileName);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send({ message: 'File not found' });
  }
});

router.get('/download/:name', (req, res) => {
  const fileName = req.params.name;
  const filePath = path.join(__dirname, '../uploads', fileName);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send({ message: 'File not found' });
  }
});

module.exports = router;
