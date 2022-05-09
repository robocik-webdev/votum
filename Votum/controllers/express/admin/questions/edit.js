const pool = require('../../../../db');
const { modifyQuestion } = require('../../../../schema/adminSchema');
const generateAnswers = require('../../../../utils/generateAnswers');
const ioAdminQuestions = require('../../../socketController').adminQuestions;
const ioAdminRefresh = require('../../../socketController').adminRefresh;

const editQuestion = async (req, res) => {
  let message = req.body;
  message.id = req.params.id;
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
          'UPDATE questions SET title=$1, max_answers=$2, show_results=$3, time_open=$4, time_close=$5 WHERE id=$6',
          [
            valid.title,
            valid.maxAnswers,
            valid.showResults,
            valid.timeOpen,
            valid.timeClose,
            valid.id
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
              generateAnswers(valid.answers, valid.id).then(result => {
                res.status(result.status).json(result);
                ioAdminQuestions(req.app.get('io'));
                ioAdminRefresh(req.app.get('io'));
              });
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
