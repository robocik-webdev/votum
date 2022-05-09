const pool = require('../../../../db');
const modifyAnswer = require('../../../../schema/adminSchema');

const editAnswer = async (req, res) => {
  modifyAnswer
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
          'UPDATE answers SET title=$1 WHERE id=$2',
          [message.title, message.id],
          (err, result) => {
            if (err) {
              res.status(406).json({
                success: false,
                status: 406,
                error: 'Nie można zmodyfikować odpowiedzi',
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

module.exports = editAnswer;
