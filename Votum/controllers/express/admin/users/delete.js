const pool = require('../../../../db');
const ioAdminUsers = require('../../../socketController').adminUsers;
const idValidation = require('../../../../schema/idValidation');

const deleteUser = async (req, res) => {
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
    .then(valid => {
      if (valid) {
        pool.query(`DELETE FROM users WHERE id=$1`, [valid.id], err => {
          if (err) {
            res.status(406).json({
              success: false,
              status: 406,
              error: 'Nie udało się usunąć użytkownika',
              errorDetails: err
            });
          } else {
            res.status(200).json({ success: true, status: 200 });
            ioAdminUsers(req.app.get('io'));
          }
        });
      }
    });
};

module.exports = deleteUser;
