const pool = require('../db'); // Assuming you have a database connection module

const findUserByNameAndUid = (name, uId, callback) => {
  const query = `
    SELECT * FROM LoginInfo WHERE employeeName = ? AND u_id = ?
  `;
  const values = [name, uId];

  pool.query(query, values, (error, results) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, results);
  });
};

module.exports = { findUserByNameAndUid };
