const idValidation = require('../../../../schema/idValidation');
const pool = require('../../../../db');

const openQuestion = async (req, res) => {
  idValidation
    .validate(req.params)
    .catch(err => {
      res.status(400).json({
        success: false,
        status: 400,
        error: 'Niepoprawne zapytanie',
        errorDetails: err
      });
    })
    .then(async valid => {
      if (valid) {
        const question = await pool.query(
          `SELECT * FROM questions WHERE id=$1 AND time_open <= now()`,
          [valid.id],
          async (err, result) => {
            if (err) {
              res.status(403).json({
                success: false,
                status: 403,
                error: 'Problem z zapytaniem',
                errorDetails: err
              });
            } else {
              if (result.rows.length > 0) {
                if (result.rows[0].timeClose > Date.now()) {
                  const answers = await pool.query(
                    `SELECT id, title FROM answers WHERE questions_id=$1`,
                    [valid.id]
                  );
                  res.status(300).json({
                    success: true,
                    status: 300,
                    data: {
                      question: result.rows[0],
                      answers: answers.rows
                    }
                  });
                } else if (result.rows[0].showResults) {
                  const answers = await pool.query(
                    `SELECT a.title AS title, count(aq.id) AS count
                    FROM answers a
                      INNER JOIN questions q ON q.id = a.questions_id
                      LEFT JOIN answered_questions aq ON a.id = aq.answers_id
                    WHERE now() > q.time_close AND q.id = $1
                    GROUP BY q.title, a.title, q.id, a.id
                    ORDER BY q.id, a.id;`,
                    [valid.id]
                  );
                  res.status(200).json({
                    success: true,
                    status: 200,
                    data: {
                      question: result.rows[0],
                      answers: answers.rows
                    }
                  });
                } else {
                  res.status(403).json({
                    success: false,
                    status: 403,
                    error: 'Wyniki jeszcze nieudostępnione!'
                  });
                }
              } else {
                res
                  .status(403)
                  .json({ success: false, status: 403, error: 'Niedostępne' });
              }
            }
          }
        );
      }
    });
};

module.exports = openQuestion;
