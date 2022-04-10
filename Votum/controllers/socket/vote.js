const voteValidation = require('../../schema/vote');
const pool = require('../../db');
const checkPrivilage = require('../../utils/checkPrivilage');

const vote = async (socket, message) => {
  voteValidation
    .validate(message)
    .catch(() => {
      socket.emit('vote', { status: 400 });
    })
    .then(async valid => {
      if (valid) {
        const question = await pool.query(
          `SELECT * FROM questions WHERE open_time <= now() AND close_time > now() AND id = $1;`,
          [message.id]
        );
        if (question.rowCount == 1) {
          const status = await checkPrivilage(socket.user, message.id);
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
              message.answers.length <= question.rows[0].possible_answers
            ) {
              message.answers.forEach(element => {
                pool.query(
                  `INSERT INTO answered_questions (id, questions_id, answers_id) VALUES (DEFAULT, $1, $2)`,
                  [message.id, element]
                );
              });
              pool.query(
                `INSERT INTO users_has_questions (id, users_id, questions_id) VALUES (DEFAULT, $1, $2)`,
                [socket.user.id, message.id]
              );
              socket.emit('vote', { status: 200 });
              return true;
            } else {
              socket.emit('vote', {
                status: 400,
                data: { message: 'Wrong answers' }
              });
            }
          } else {
            socket.emit('vote', {
              status: 403,
              data: { message: 'You have no privilage to vote' }
            });
          }
        } else {
          socket.emit('vote', {
            status: 403,
            data: { message: "Question hasn't opened yet" }
          });
        }
      } else {
        socket.emit('vote', { status: 400, data: { message: 'Invalid json' } });
      }
    });
};

module.exports = vote;
