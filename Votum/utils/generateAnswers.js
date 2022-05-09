const pool = require('../db');

const generateAnswers = async (answers, questionID) => {
  var p = new Promise(async res => {
    Promise.resolve(
      pool.query(
        'DELETE FROM answers WHERE questions_id = $1',
        [questionID],
        async (err, result) => {
          if (err) {
            res({
              success: false,
              status: 400,
              error: 'Nie udało się usunąć odpowiedzi!'
            });
          } else {
            var errCount = 0;
            var errReason = [];
            var promises = [];
            for (const answer of answers) {
              promises.push(
                pool
                  .query(
                    'INSERT INTO answers (title, questions_id) VALUES($1,$2)',
                    [answer, questionID]
                  )
                  .catch(err => {
                    errCount++;
                    errReason.push(err);
                  })
              );
            }
            Promise.all(promises).then(() => {
              if (errCount == 0) {
                res({
                  success: true,
                  status: 200,
                  data: { addedAnswers: promises.length }
                });
              } else {
                res({
                  success: false,
                  status: 300,
                  error: 'Nie udało się wstawić wszystkich rekordów!',
                  errorDetails: errReason,
                  data: {
                    addedAnswers: promises.length - errCount
                  }
                });
              }
            });
          }
        }
      )
    );
  });
  return p;
};

module.exports = generateAnswers;
