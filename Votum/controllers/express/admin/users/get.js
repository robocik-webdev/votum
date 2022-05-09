const pool = require('../../../../db');
const idValidation = require('../../../../schema/idValidation');

const getUsers = async (req, res) => {
  const users = await pool.query(`SELECT * FROM users`);
  res.status(200).json({
    success: true,
    status: 200,
    data: { users: users.rows }
  });
};

const getUser = async (req, res) => {
  idValidation
    .validate(req.params)
    .catch(err => {
      res.status(400).json({
        success: false,
        status: 400,
        error: 'Nieprawidłowy format zapytania',
        errorDetails: err
      });
    })
    .then(async valid => {
      if (valid) {
        const users = await pool.query(`SELECT * FROM users WHERE id=$1`, [
          valid.id
        ]);
        if (users.rows[0]) {
          res.status(200).json({
            success: true,
            status: 200,
            data: { user: users.rows[0] }
          });
        } else {
          res.status(404).json({
            success: true,
            status: 404,
            data: {
              success: false,
              status: 404,
              error: 'Nie znaleziono użytkownika'
            }
          });
        }
      }
    });
};

module.exports = { getUsers, getUser };
