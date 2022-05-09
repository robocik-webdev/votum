const pool = require('../../../../db');
const idValidation = require('../../../../schema/adminSchema');

const deleteQuestion = async (req, res) => {
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
          `DELETE FROM users_has_questions WHERE questions_id=$1`,
          [message.id],
          (err, result) => {
            if (err) {
              res.status(406).json({
                success: false,
                status: 406,
                error: 'Nie udało się usunać pytania',
                errorDetails: err
              });
            } else {
              pool.query(
                `DELETE FROM answered_questions WHERE questions_id=$1`,
                [message.id],
                (err, result) => {
                  if (err) {
                    res.status(406).json({
                      success: false,
                      status: 406,
                      error: 'Nie udało się usunąć pytania',
                      errorDetails: err
                    });
                  } else {
                    pool.query(
                      `DELETE FROM answers WHERE questions_id=$1`,
                      [message.id],
                      (err, result) => {
                        if (err) {
                          res.status(406).json({
                            success: false,
                            status: 406,
                            error: 'Nie udało się usunąć pytania',
                            errorDetails: err
                          });
                        } else {
                          pool.query(
                            `DELETE FROM questions WHERE id=$1`,
                            [message.id],
                            (err, result) => {
                              if (err) {
                                res.status(406).json('adminRemoveQuestion', {
                                  success: false,
                                  status: 406,
                                  error: 'Nie udało się usunąć pytania',
                                  errorDetails: err
                                });
                              } else {
                                res
                                  .status(200)
                                  .json({ success: true, status: 200 });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
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

module.exports = deleteQuestion;
