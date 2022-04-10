const { jwtVerify } = require('../jwt/jwtAuth');
const pool = require('../../db');
const availableQuestions = require('../../utils/availableQuestions');
const {
  newAnswer,
  newUser,
  newQuestion,
  modifyAnswer,
  modifyUser,
  modifyQuestion,
  userCSV,
  questionShowAnswers,
  userPrivilage,
  idValidation
} = require('../../schema/adminSchema');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const authorizeAdmin = async (socket, next, data = {}) => {
  const token = socket.handshake.auth.token;
  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const potentialAdmin = await pool.query(
        `SELECT admin FROM users u WHERE u.id='${[decoded.id]}'`
      );
      if (potentialAdmin.rowCount > 0) {
        if (potentialAdmin.rows[0].admin) {
          next(socket, data);
        } else {
          throw new ValidationError('No admin');
        }
      } else {
        throw new ValidationError('Not admin');
      }
    })
    .catch(err => {
      console.log('Bad request!', err);
      return false;
    });
};

const adminRefresh = async socket => {
  socket
    .to('votum')
    .emit('questions', { questions: await availableQuestions() });
};

const adminQuestions = async socket => {
  const availablePolls = await pool.query(`SELECT * FROM questions`);
  for (const element of availablePolls.rows) {
    availableAnswers = await pool.query(
      `SELECT * FROM answers where questions_id = ${element.id};`
    );
    element.answers = availableAnswers.rows;
  }
  socket.emit('adminQuestions', {
    status: 200,
    data: { questions: availablePolls.rows }
  });
};

const adminUsers = async socket => {
  const users = await pool.query(`SELECT * FROM users`);
  socket.emit('adminUsers', { status: 200, data: { users: users.rows } });
};

const adminAddAnswer = async (socket, message) => {
  newAnswer
    .validate(message)
    .catch(err => {
      console.log(err);
    })
    .then(valid => {
      if (valid) {
        pool.query(
          `INSERT INTO answers (id, title, questions_id) VALUES (DEFAULT, $1, $2);`,
          [message.answer, message.questionId],
          (err, res) => {
            if (err) {
              socket.emit('adminAddAnswer', {
                status: 406,
                data: { error: err }
              });
            } else {
              socket.emit('adminAddAnswer', { status: 200 });
              adminQuestions(socket);
              adminRefresh(socket);
            }
          }
        );
      } else {
        socket.emit('adminAddAnswer', { status: 400 });
      }
    });
};

const adminModifyAnswer = async (socket, message) => {
  modifyAnswer
    .validate(message)
    .catch(err => {
      console.log(err);
    })
    .then(valid => {
      if (valid) {
        pool.query(
          'UPDATE answers SET title=$1 WHERE id=$2',
          [message.answer, message.id],
          (err, res) => {
            if (err) {
              socket.emit('adminModifyAnswer', {
                status: 406,
                data: { error: err }
              });
            } else {
              socket.emit('adminModifyAnswer', { status: 200 });
              adminQuestions(socket);
              adminRefresh(socket);
            }
          }
        );
      } else {
        socket.emit('adminModifyAnswer', { status: 400 });
      }
    });
};

const adminRemoveAnswer = async (socket, message) => {
  idValidation
    .validate(message)
    .catch(err => {
      console.log(err);
    })
    .then(valid => {
      if (valid) {
        pool.query(
          `DELETE FROM answers WHERE id=$1`,
          [message.id],
          (err, res) => {
            if (err) {
              socket.emit('adminRemoveAnswer', {
                status: 406,
                data: { error: err }
              });
            } else {
              socket.emit('adminRemoveAnswer', { status: 200 });
              adminQuestions(socket);
              adminRefresh(socket);
            }
          }
        );
      } else {
        console.log('invalid');
      }
    });
};
const adminAddQuestion = async (socket, message) => {
  newQuestion
    .validate(message)
    .catch(err => {
      console.log(err);
    })
    .then(valid => {
      if (valid) {
        pool.query(
          `INSERT INTO questions (title, possible_answers, show_answers, open_time, close_time) VALUES ($1, $2, $3, $4, $5);`,
          [
            message.question,
            message.possibleAnswers,
            message.showAnswers,
            message.openTime,
            message.closeTime
          ],
          (err, res) => {
            if (err) {
              socket.emit('adminAddQuestion', {
                status: 406,
                data: { error: err }
              });
            } else {
              socket.emit('adminAddQuestion', { status: 200 });
              adminQuestions(socket);
              adminRefresh(socket);
            }
          }
        );
      } else {
        socket.emit('adminAddQuestion', { status: 400 });
      }
    });
};

const adminModifyQuestnion = async (socket, message) => {
  modifyQuestion
    .validate(message)
    .catch(err => {
      console.log(err);
    })
    .then(valid => {
      if (valid) {
        pool.query(
          'UPDATE questions SET title=$1, possible_answers=$2, show_answers=$3, open_time=$4, close_time=$5 WHERE id=$6',
          [
            message.question,
            message.possibleAnswers,
            message.showAnswers,
            message.openTime,
            message.closeTime,
            message.id
          ],
          (err, res) => {
            if (err) {
              socket.emit('adminModifyQuestion', {
                status: 406,
                data: { error: err }
              });
            } else {
              socket.emit('adminModifyQuestion', { status: 200 });
              adminQuestions(socket);
              adminRefresh(socket);
            }
          }
        );
      } else {
        socket.emit('adminModifyQuestion', { status: 400 });
      }
    });
};
const adminRemoveQuestion = async (socket, message) => {
  idValidation
    .validate(message)
    .catch(err => {
      console.log(err);
    })
    .then(valid => {
      if (valid) {
        pool.query(
          `DELETE FROM users_has_questions WHERE questions_id=$1`,
          [message.id],
          (err, res) => {
            if (err) {
              socket.emit('adminRemoveQuestion', {
                status: 406,
                data: { error: err }
              });
            } else {
              pool.query(
                `DELETE FROM answered_questions WHERE questions_id=$1`,
                [message.id],
                (err, res) => {
                  if (err) {
                    socket.emit('adminRemoveQuestion', {
                      status: 406,
                      data: { error: err }
                    });
                  } else {
                    pool.query(
                      `DELETE FROM answers WHERE questions_id=$1`,
                      [message.id],
                      (err, res) => {
                        if (err) {
                          socket.emit('adminRemoveQuestion', {
                            status: 406,
                            data: { error: err }
                          });
                        } else {
                          pool.query(
                            `DELETE FROM questions WHERE id=$1`,
                            [message.id],
                            (err, res) => {
                              if (err) {
                                socket.emit('adminRemoveQuestion', {
                                  status: 406,
                                  error: err
                                });
                              } else {
                                socket.emit('adminRemoveQuestion', {
                                  status: 200
                                });
                                adminQuestions(socket);
                                adminRefresh(socket);
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
        socket.emit('adminRemoveQuestion', { status: 400 });
      }
    });
};

const adminSetQuestionShowAnswers = async (socket, message) => {
  questionShowAnswers
    .validate(message)
    .catch(err => {
      console.log(err);
    })
    .then(valid => {
      if (valid) {
        pool.query(
          'UPDATE questions SET show_answers=$1 where id=$2',
          [message.showAnswers, message.id],
          (err, res) => {
            if (err) {
              socket.emit('adminSetQuestionShowAnswers', {
                status: 406,
                data: { error: err }
              });
            } else {
              socket.emit('adminSetQuestionShowAnswers', { status: 200 });
              adminQuestions(socket);
              adminRefresh(socket);
            }
          }
        );
      } else {
        socket.emit('adminSetQuestionShowAnswers', { status: 400 });
      }
    });
};

function makeToken(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const adminAddUser = async (socket, message) => {
  newUser
    .validate(message)
    .catch(err => {
      console.log(err);
    })
    .then(valid => {
      if (valid) {
        pool.query(
          `INSERT INTO users (name, surname, email, token, right_to_vote, admin) VALUES ($1,$2,$3,$4,$5,$6);`,
          [
            message.name,
            message.surname,
            message.email,
            makeToken(8),
            message.rightToVote,
            message.admin
          ],
          (err, res) => {
            if (err) {
              socket.emit('adminAddUser', {
                status: 406,
                data: { error: err }
              });
            } else {
              socket.emit('adminAddUser', { status: 200 });
              adminUsers(socket);
            }
          }
        );
      } else {
        socket.emit('adminAddUser', { status: 400 });
      }
    });
};
const adminModifyUser = async (socket, message) => {
  modifyUser
    .validate(message)
    .catch(err => {
      console.log(err);
    })
    .then(valid => {
      if (valid) {
        pool.query(
          'UPDATE users SET name=$1, surname=$2, email=$3, right_to_vote=$4, admin=$5 WHERE id=$6',
          [
            message.name,
            message.surname,
            message.email,
            message.rightToVote,
            message.admin,
            message.id
          ],
          (err, res) => {
            if (err) {
              socket.emit('adminModifyUser', {
                status: 406,
                data: { error: err }
              });
            } else {
              socket.emit('adminModifyUser', { status: 200 });
              adminUsers(socket);
            }
          }
        );
      } else {
        socket.emit('adminModifyUser', { status: 400 });
      }
    });
};
const adminRemoveUser = async (socket, message) => {
  idValidation
    .validate(message)
    .catch(err => {
      console.log(err);
    })
    .then(valid => {
      if (valid) {
        pool.query(
          `DELETE FROM users WHERE id=$1`,
          [message.id],
          (err, res) => {
            if (err) {
              socket.emit('adminRemoveUser', {
                status: 406,
                data: { error: err }
              });
            } else {
              socket.emit('adminRemoveUser', { status: 200 });
              adminUsers(socket);
            }
          }
        );
      } else {
        socket.emit('adminRemoveUser', { status: 400 });
      }
    });
};

const adminSetUserPrivilage = async (socket, message) => {
  userPrivilage
    .validate(message)
    .catch(err => {
      console.log(err);
    })
    .then(valid => {
      if (valid) {
        pool.query(
          'UPDATE users SET right_to_vote=$1 where id=$2',
          [message.rightToVote, message.id],
          (err, res) => {
            if (err) {
              socket.emit('adminSetUserPrivilage', {
                status: 406,
                data: { error: err }
              });
            } else {
              socket.emit('adminSetUserPrivilage', { status: 200 });
              adminUsers(socket);
            }
          }
        );
      } else {
        socket.emit('adminSetUserPrivilage', { status: 400 });
      }
    });
};

const adminImportUsers = async (socket, message) => {};

module.exports = {
  adminRefresh,
  authorizeAdmin,
  adminQuestions,
  adminUsers,
  adminAddAnswer,
  adminModifyAnswer,
  adminRemoveAnswer,
  adminAddQuestion,
  adminModifyQuestnion,
  adminRemoveQuestion,
  adminSetQuestionShowAnswers,
  adminAddUser,
  adminModifyUser,
  adminRemoveUser,
  adminSetUserPrivilage,
  adminImportUsers
};
