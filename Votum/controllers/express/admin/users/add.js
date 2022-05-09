const pool = require('../../../../db');
const makeToken = require('../../../../utils/makeToken');
const { newUser } = require('../../../../schema/adminSchema');
const ioAdminUsers = require('../../../socketController').adminUsers;

const addUser = async (req, res) => {
  newUser
    .validate(req.body)
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
        pool.query(
          `INSERT INTO users (name, surname, email, token, right_to_vote, admin) VALUES ($1,$2,$3,$4,$5,$6);`,
          [
            valid.name,
            valid.surname,
            valid.email,
            makeToken(8),
            valid.rightToVote,
            valid.admin
          ],
          (err, result) => {
            if (err) {
              res.status(406).json({
                success: false,
                status: 406,
                error: 'Nie udało się dodać użytkownika',
                errorDetails: err
              });
            } else {
              res.status(200).json({ success: true, status: 200 });
              ioAdminUsers(req.app.get('io'));
            }
          }
        );
      }
    });
};

module.exports = addUser;
