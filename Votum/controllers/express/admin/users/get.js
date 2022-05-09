const pool = require('../../../../db');

const getUsers = async (req, res) => {
  const users = await pool.query(`SELECT * FROM users`);
  res.status(200).json({
    success: true,
    status: 200,
    data: { users: users.rows }
  });
};

module.exports = getUsers;
