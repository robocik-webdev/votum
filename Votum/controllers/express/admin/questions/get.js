const pool = require('../../../../db');
const idValidation = require('../../../../schema/idValidation');
const { questions } = require('../../adminController');

const getQuestions = async (req, res) => {
  const availablePolls = await pool.query(`SELECT * FROM questions`);
  for (const element of availablePolls.rows) {
    availableAnswers = await pool.query(
      `SELECT * FROM answers where questions_id = ${element.id} ORDER BY id ASC;`
    );
    element.answers = availableAnswers.rows;
  }
  res.status(200).json({
    success: true,
    status: 200,
    data: { questions: availablePolls.rows }
  });
};

const getQuestion = async (req, res) => {
  idValidation
    .validate(req.params)
    .catch(err => {
      res.status(400).json({
        success: false,
        status: 400,
        error: 'Nieprawidłowy format zapytania',
        errorDetails: err
      });
    })
    .then(async valid => {
      const question = await pool.query(`SELECT * FROM questions WHERE id=$1`, [
        valid.id
      ]);
      if (question.rows.length > 0) {
        result = question.rows[0];
        availableAnswers = await pool.query(
          `SELECT * FROM answers where questions_id = $1 ORDER BY id ASC;`,
          [valid.id]
        );
        result.answers = availableAnswers.rows;

        res.status(200).json({
          success: true,
          status: 200,
          data: result
        });
      } else {
        res.status(404).json({
          success: false,
          status: 404,
          error: 'Nie znaleziono pytania!'
        });
      }
    });
};

module.exports = { getQuestions, getQuestion };
