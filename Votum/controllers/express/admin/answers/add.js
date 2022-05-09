const pool = require('../../../../db');
const newAnswer = require('../../../../schema/adminSchema');

const addAnswer = async (req, res) => {
  newAnswer
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
          `INSERT INTO answers (id, title, questions_id) VALUES (DEFAULT, $1, $2);`,
          [message.title, message.questionId],
          (err, result) => {
            if (err) {
              res.status(406).json({
                success: false,
                status: 406,
                error: 'Nie można dodać odpowiedzi',
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

module.exports = addAnswer;
