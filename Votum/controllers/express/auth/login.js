const pool = require('../../../db');

const login = async (req, res) => {
  const sess = req.session;
  token = req.body.token;

  const potentialLogin = await pool.query(
    `SELECT id, name, surname, token, email, admin FROM users u WHERE u.token='${[
      token
    ]}'`
  );

  if (potentialLogin.rowCount > 0) {
    const { id, name, surname, email, admin } = potentialLogin.rows[0];
    sess.email = email;
    sess.userID = id;
    sess.authenticated = true;
    res.status(200).json({
      success: true,
      status: 200,
      data: { name: name, surname: surname, email: email, admin: admin }
    });
  } else {
    res.status(200).json({
      success: false,
      status: 400,
      error: 'Nieprawidłowy token logujący'
    });
  }
};
module.exports = login;
