const pool = require('../../../../db');
const authorizeAdmin = async (req, res, next) => {
  const id = req.session.userID;

  const potentialAdmin = await pool.query(
    `SELECT admin FROM users u WHERE u.id='${[id]}'`
  );
  if (potentialAdmin.rowCount > 0) {
    if (potentialAdmin.rows[0].admin) {
      next(socket, data);
    } else {
      res.status(400).json({
        success: false,
        status: 400,
        error: 'Nieupoważnionym wstęp wzbroniony'
      });
      throw new ValidationError('No admin');
    }
  } else {
    res.status(400).json({
      success: false,
      status: 400,
      error: 'Nieupoważnionym wstęp wzbroniony'
    });
    throw new ValidationError('No admin');
  }
};

module.exports = authorizeAdmin;
