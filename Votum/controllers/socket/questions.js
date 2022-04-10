const availableQuestions = require('../../utils/availableQuestions');
const questions = async socket => {
  socket.emit('questions', {
    status: 200,
    data: {
      questions: await availableQuestions()
    }
  });
};
module.exports = questions;
