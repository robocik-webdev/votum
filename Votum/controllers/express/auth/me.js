const pool = require('../../../db');

const me = async (req, res) => {
  const userID = req.session.userID;
  const user = await pool.query(
    `SELECT id, name, surname, token, email, admin FROM users u WHERE u.id='${[
      userID
    ]}'`
  );

  if (user.rowCount > 0) {
    const { id, name, surname, email, admin } = user.rows[0];
    res.status(200).json({
      success: true,
      status: 200,
      data: { name: name, surname: surname, email: email, admin: admin }
    });
  } else {
    res.status(200).json({
      success: false,
      status: 400,
      error: 'Nie udało się określić użytkownika'
    });
  }
};
module.exports = me;
