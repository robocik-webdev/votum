const pool = require('../../../../db');
const { newQuestion } = require('../../../../schema/adminSchema');
const generateAnswers = require('../../../../utils/generateAnswers');
const ioAdminQuestions = require('../../../socketController').adminQuestions;
const ioAdminRefresh = require('../../../socketController').adminRefresh;

const addQuestion = async (req, res) => {
  newQuestion
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
          `INSERT INTO questions (title, max_answers, show_results, time_open, time_close) VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
          [
            valid.title,
            valid.maxAnswers,
            valid.showResults,
            valid.timeOpen,
            valid.timeClose
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
              generateAnswers(valid.answers, result.rows[0].id).then(result => {
                res.status(result.status).json(result);
                ioAdminQuestions(req.app.get('io'));
                ioAdminRefresh(req.app.get('io'));
              });
            }
          }
        );
      }
    });
};

module.exports = addQuestion;
