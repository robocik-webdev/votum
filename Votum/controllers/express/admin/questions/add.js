const pool = require('../../../../db');
const newQuestion = require('../../../../schema/adminSchema');

const addQuestion = async (req, res) => {
  newQuestion
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
          `INSERT INTO questions (title, possible_answers, show_answers, time_open, time_close) VALUES ($1, $2, $3, $4, $5);`,
          [
            message.title,
            message.possibleAnswers,
            message.showAnswers,
            message.timeOpen,
            message.timeClose
          ],
          (err, result) => {
            if (err) {
              res.status(406).json({
                success: false,
                status: 406,
                error: 'Brak możliwości dodania pytania!',
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
          error: 'Nieprawidłowe zapytanie!'
        });
      }
    });
};
