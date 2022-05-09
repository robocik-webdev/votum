const pool = require('../../../../db');
const newUser = require('../../../../schema/adminSchema');

const addUser = async (req, res) => {
  newUser
    .validate(message)
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
            message.name,
            message.surname,
            message.email,
            makeToken(8),
            message.rightToVote,
            message.admin
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
            }
          }
        );
      } else {
        res.status(400).json({
          success: false,
          status: 400,
          error: 'Nieprawidłowe zapytanie'
        });
      }
    });
};

module.exports = addUser;
