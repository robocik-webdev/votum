const voteValidation = require('../../../../schema/vote');
const pool = require('../../../../db');
const checkPrivilage = require('../../../../utils/checkPrivilage');

const vote = async (req, res) => {
  let message = req.body;
  message.id = req.params.id;
  let userID = req.session.userID;
  voteValidation
    .validate(message)
    .catch(err => {
      res.status(400).json({
        success: false,
        status: 400,
        error: 'Nieprawidłowe zapytanie',
        errorDetails: err
      });
    })
    .then(async valid => {
      if (valid) {
        const question = await pool.query(
          `SELECT * FROM questions WHERE time_open <= now() AND time_close > now() AND id = $1;`,
          [message.id]
        );
        if (question.rowCount == 1) {
          const status = await checkPrivilage(userID, message.id);
          if (status == true) {
            const possibleIDs = await pool.query(
              `SELECT id FROM answers WHERE questions_id=$1`,
              [message.id]
            );
            var indexes = [];
            for (const element of possibleIDs.rows) {
              indexes.push(element.id);
            }
            if (
              message.answers.every(element => indexes.includes(element)) &&
              message.answers.length <= question.rows[0].maxAnswers
            ) {
              message.answers.forEach(element => {
                pool.query(
                  `INSERT INTO answered_questions (id, questions_id, answers_id) VALUES (DEFAULT, $1, $2)`,
                  [message.id, element]
                );
              });
              pool.query(
                `INSERT INTO users_has_questions (id, users_id, questions_id) VALUES (DEFAULT, $1, $2)`,
                [userID, message.id]
              );
              res.status(200).json({ success: true, status: 200 });
              return true;
            } else {
              res.status(400).json({
                success: false,
                status: 400,
                error: 'Nieprawidłowe odpowiedzi'
              });
            }
          } else {
            res.status(403).json({
              success: false,
              status: 403,
              error: 'Brak uprawnień do głosowania'
            });
          }
        } else {
          res.status(403).json({
            success: false,
            status: 403,
            error: 'Pytanie się jeszcze nie otworzyło'
          });
        }
      }
    });
};

module.exports = vote;
