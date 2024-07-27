const jwt_decode = require('jwt-decode'); // Ensure correct import

const token = '$2b$10$A6laJUQyqA68ptvpYXVrcO0pbzMLyzfwT3exZ8MToCI9cvZWy9G9a'; // Example JWT token
try {
  const decoded = jwt_decode(token);
  console.log('Decoded Token:', decoded);
} catch (error) {
  console.error('Error decoding token:', error);
}
