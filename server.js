require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const signupRoute = require('./routes/signup');
const managerSignupRoute = require('./routes/managerSignup');
const loginRoute = require('./routes/login');
const adminLoginRoute = require('./routes/adminLogin1');
const logoutRoute = require('./routes/logout').router;
const addRoomRoute = require('./routes/addRoom1');
const checkRoomNumber = require('./routes/checkRoomNumber');
const authenticateToken = require('./middleware/auth');
const roomsRouter = require('./routes/rooms');
const bookRoomRouter = require('./routes/bookRoom');
const bookingInfoRouter = require('./routes/bookingInfo');
const editeBookingInfo = require('./routes/editeBookingInfo');
const invoiceRoutes = require('./routes/invoiceRoutes'); // Adjust the path as necessary
const stockManagementRoutes = require('./routes/stockmanagement'); // Importing the stock management routes

const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api', signupRoute);
app.use('/api', managerSignupRoute);
app.use('/api', loginRoute);
app.use('/api', adminLoginRoute);
app.use('/api', logoutRoute);
app.use('/api', addRoomRoute);
app.use('/api', checkRoomNumber);
app.use('/api', roomsRouter);
app.use('/api', bookRoomRouter);
app.use('/api', bookingInfoRouter);
app.use('/api', editeBookingInfo);
app.use('/api', invoiceRoutes);
app.use('/api', stockManagementRoutes); // Using the stock management routes

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to the Dashboard!' });
});

app.listen(port, (err) => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log(`Server is running on port: ${port}`);
  }
});
