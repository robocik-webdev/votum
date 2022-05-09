const { jwtVerify } = require('../jwt/jwtAuth');
const pool = require('../../db');
const availableQuestions = require('../../utils/availableQuestions');
const makeToken = require('../../utils/makeToken');
const regenUserToken = require('../../utils/regenUserToken');

let fs = require('fs');

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
      throw new ValidationError('Not admin');
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

module.exports = {
  adminRefresh,
  authorizeAdmin,
  adminQuestions,
  adminUsers
};
