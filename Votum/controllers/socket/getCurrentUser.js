const pool = require('../../db');
const getCurrentUser = async socket => {
  const userID = socket.request.session.userID;
  const user = await pool.query(
    `SELECT id, name, surname, token, email, admin FROM users u WHERE u.id='${[
      userID
    ]}'`
  );

  if (user.rowCount > 0) {
    const { id, name, surname, email, admin } = user.rows[0];
    if (admin) {
      socket.join('admin');
      socket.to('admin').emit(`Nowy zalogowany admin ${name} ${surname}`);
    }
    socket.emit('me', {
      success: true,
      status: 200,
      data: { name: name, surname: surname, email: email, admin: admin }
    });
  } else {
    socket.emit('me', {
      success: false,
      status: 400,
      error: 'Nie udało się określić użytkownika'
    });
  }
};

module.exports = getCurrentUser;
