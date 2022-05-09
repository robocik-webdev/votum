const idValidation = require('../../schema/idValidation');
const pool = require('../../db');

const openQuestion = async (socket, message) => {
  idValidation
    .validate(message)
    .catch(() => {
      console.log('Nope');
    })
    .then(async valid => {
      if (valid) {
        const question = await pool.query(
          `SELECT * FROM questions WHERE id=$1 AND time_open <= now()`,
          [message.id],
          async (err, res) => {
            if (err) {
              socket.emit('openQuestion', { status: 403 });
            } else {
              if (res.rows.length > 0) {
                if (res.rows[0].timeClose > Date.now()) {
                  const answers = await pool.query(
                    `SELECT id, title FROM answers WHERE questions_id=$1`,
                    [message.id]
                  );
                  socket.emit('openQuestion', {
                    status: 300,
                    data: {
                      question: res.rows[0],
                      answers: answers.rows
                    }
                  });
                } else if (res.rows[0].showAnswers == true) {
                  const answers = await pool.query(
                    `SELECT a.title AS title, count(aq.id) AS count
                    FROM answers a
                      INNER JOIN questions q ON q.id = a.questions_id
                      LEFT JOIN answered_questions aq ON a.id = aq.answers_id
                    WHERE now() > q.time_close AND q.id = $1
                    GROUP BY q.title, a.title, q.id, a.id
                    ORDER BY q.id, a.id;`,
                    [message.id]
                  );
                  socket.emit('openQuestion', {
                    status: 200,
                    data: {
                      question: res.rows[0],
                      answers: answers.rows
                    }
                  });
                } else {
                  socket.emit('openQuestion', { status: 403 });
                }
              } else {
                socket.emit('openQuestion', { status: 403 });
              }
            }
          }
        );
      } else {
        socket.emit('openQuestion', { status: 400 });
      }
    });
};

module.exports = openQuestion;
