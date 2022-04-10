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
          [message.questionID]
        );
        if (question.rowCount == 1) {
          const status = await checkPrivilage(socket.user, message.questionID);
          if (status == true) {
            const possibleIDs = await pool.query(
              `SELECT id FROM answers WHERE questions_id=$1`,
              [message.questionID]
            );
            var indexes = [];
            for (const element of possibleIDs.rows) {
              indexes.push(element.id);
            }
            if (message.answers.every(element => indexes.includes(element))) {
              message.answers.forEach(element => {
                pool.query(
                  `INSERT INTO answered_questions (id, questions_id, answers_id) VALUES (DEFAULT, $1, $2)`,
                  [message.questionID, element]
                );
              });
              pool.query(
                `INSERT INTO users_has_questions (id, users_id, questions_id) VALUES (DEFAULT, $1, $2)`,
                [socket.user.id, message.questionID]
              );
              socket.emit('vote', { status: 200 });
              return true;
            } else {
              socket.emit('vote', { status: 400 });
            }
          } else {
            socket.emit('vote', { status: 403 });
          }
        } else {
          socket.emit('vote', { status: 403 });
        }
      } else {
        socket.emit('vote', { status: 400 });
      }
    });
};

module.exports = vote;
