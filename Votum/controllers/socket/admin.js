const { jwtVerify } = require('../jwt/jwtAuth');
const pool = require('../../db');
const availableQuestions = require('../../utils/availableQuestions');
const makeToken = require('../../utils/makeToken');
const regenUserToken = require('../../utils/regenUserToken');
const papa = require('papaparse');

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
          [message.title, message.questionId],
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
          [message.title, message.id],
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
            message.title,
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
            message.title,
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
        pool.query(`DELETE FROM users WHERE id=$1`, [message.id], err => {
          if (err) {
            socket.emit('adminRemoveUser', {
              status: 406,
              data: { error: err }
            });
          } else {
            socket.emit('adminRemoveUser', { status: 200 });
            adminUsers(socket);
          }
        });
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

const adminImportUsers = async (socket, message) => {
  await userCSV
    .validate(message)
    .catch(err => socket.emit('adminRegenUserToken', { status: 400, err: err }))
    .then(async valid => {
      if (valid.deleteUsers) {
        await pool.query('DELETE FROM users WHERE id!=$1', [socket.user.id]);
      }
      var parsedCSV = [];
      if (valid.head) {
        let test =
          '"name","surname","email","rightToVote","admin"\n"Andrzej","Gębura","420@student.pwr.edu.pl","true","false"';
        parsedCSV = papa.parse(string, {
          header: true
        });
        console.log(test);
        console.log(parsedCSV);
      } else {
      }
      for (const [i, elem] of parsedCSV) {
        parsedCSV[i].rightToVote = JSON.decode(elem.rightToVote);
        parsedCSV[i].admin = JSON.decode(elem.admin);
      }
      console.log(parsedCSV);
      //newUser.validate(parsedCSV[0]);
    });
};

const adminRegenUserToken = async (socket, message) => {
  idValidation
    .validate(message)
    .catch(err => {
      console.log(err);
    })
    .then(valid => {
      if (valid) {
        regenUserToken(message.id).then(err => {
          if (err) {
            socket.emit('adminRegenUserToken'), { status: 400, err: err };
          } else {
            socket.emit('adminRegenUserToken', { status: 200 });
            adminUsers(socket);
          }
        });
      } else {
        socket.emit('adminRegenUserToken', { status: 400 });
      }
    });
};

const adminRegenAllUserTokens = async socket => {
  var x = 0;
  ids = await pool.query('SELECT id FROM users', async (err, res) => {
    for (const element of res.rows) {
      const err = await regenUserToken(element.id);
      if (err) {
        x++;
      }
    }
    if (x > 0) {
      socket.emit('adminRegenAllUserTokens', { status: 400, err: err });
    } else {
      socket.emit('adminRegenAllUserTokens', { status: 200 });
    }
    adminUsers(socket);
  });
};

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
  adminRegenUserToken,
  adminRegenAllUserTokens,
  adminImportUsers
};
