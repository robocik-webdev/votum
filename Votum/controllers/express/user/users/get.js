const getCurrentUser = async socket => {
  socket.emit('getCurrentUser', {
    name: socket.user.name,
    surname: socket.user.surname
  });
};

module.exports = getCurrentUser;
