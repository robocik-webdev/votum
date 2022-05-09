const pool = require('../../../../db');
const { questionShowAnswers } = require('../../../../schema/adminSchema');

const setShowResults = async (req, res) => {
  let message = req.body;
  message.id = req.params.id;
  questionShowAnswers
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
          'UPDATE questions SET show_results=$1 where id=$2',
          [message.showResults, message.id],
          (err, result) => {
            if (err) {
              res.status(406).json({
                success: false,
                status: 406,
                error:
                  'Nie udało się przełączyć możliwości wyświetlania wyników',
                errorDetails: err
              });
            } else {
              res.status(200).json({ success: true, status: 200 });
            }
          }
        );
      }
    });
};

module.exports = setShowResults;
