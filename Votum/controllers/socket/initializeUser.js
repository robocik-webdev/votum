const initializeUser = async socket => {
  socket.join('votum');
  socket.join(socket.id);
  socket.to(socket.user.userid).emit('message', { status: 'logged in' });
};

module.exports = initializeUser;
