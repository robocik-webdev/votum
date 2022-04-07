const initializeUser = async socket => {
    socket.join("votum");
}

module.exports = initializeUser;