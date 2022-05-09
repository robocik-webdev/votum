const pool = require('../../../../db');
const idValidation = require('../../../../schema/adminSchema');

const deleteAnswer = async (req, res) => {
  idValidation
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
          `DELETE FROM answers WHERE id=$1`,
          [message.id],
          (err, result) => {
            if (err) {
              res.status(406).json({
                success: false,
                status: 406,
                error: 'Nie można usunąć odpowiedzi',
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
          error: 'Nieprawidłowy format zapytania'
        });
      }
    });
};

module.exports = deleteAnswer;
