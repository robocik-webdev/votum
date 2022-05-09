const pool = require('../../../../db');
const modifyUser = require('../../../../schema/adminSchema');

const editUser = async (req, res) => {
  modifyUser
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
          'UPDATE users SET name=$1, surname=$2, email=$3, right_to_vote=$4, admin=$5 WHERE id=$6',
          [
            message.name,
            message.surname,
            message.email,
            message.rightToVote,
            message.admin,
            message.id
          ],
          (err, result) => {
            if (err) {
              res.status(406).json({
                success: false,
                status: 406,
                error: 'Nie udało się zaktualizować użytkownika',
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

module.exports = editUser;
