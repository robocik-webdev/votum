const availableQuestions = require('../../utils/availableQuestions');
const questions = async socket => {
  socket.emit('questions', {
    status: 301,
    questions: await availableQuestions()
  });
};
module.exports = questions;
