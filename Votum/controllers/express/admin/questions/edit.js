const pool = require('../../../../db');
const { modifyQuestion } = require('../../../../schema/adminSchema');

const editQuestion = async (req, res) => {
  modifyQuestion
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
          'UPDATE questions SET title=$1, possible_answers=$2, show_results=$3, time_open=$4, time_close=$5 WHERE id=$6',
          [
            message.title,
            message.possibleAnswers,
            message.showResults,
            message.timeOpen,
            message.timeClose,
            message.id
          ],
          (err, result) => {
            if (err) {
              res.status(406).json({
                success: false,
                status: 406,
                error: 'Nie udało się zaktualizować pytania',
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

module.exports = editQuestion;
