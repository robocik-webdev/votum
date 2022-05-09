const availableQuestions = require('../../utils/availableQuestions');
const questions = async socket => {
  socket.emit('questions', {
    success: true,
    status: 200,
    data: {
      questions: await availableQuestions()
    }
  });
};
module.exports = questions;
