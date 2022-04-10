const availableQuestions = require('../../utils/availableQuestions');
const initializeUser = async socket => {
  socket.join('votum');
  socket.join(socket.id);
  socket.emit('questions', {
    status: 301,
    questions: await availableQuestions()
  });
};

module.exports = initializeUser;
