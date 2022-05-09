const pool = require('../../../db');

const checkIfAdmin = async req => {
  var p = new Promise(async res => {
    var admin = false;
    var promises = [];

    promises.push(
      pool
        .query(`SELECT admin FROM users u WHERE u.id=$1`, [req.session.userID])
        .then(result => {
          if (result.rows.length > 0) {
            admin = result.rows[0].admin;
          }
        })
    );

    Promise.all(promises).then(() => {
      if (admin) {
        res({
          admin: true
        });
      } else {
        res({
          admin: false
        });
      }
    });
  });
  return p;
};

const authorizeAdmin = async (req, res, next) => {
  const id = req.session.userID;

  const potentialAdmin = await pool.query(
    `SELECT admin FROM users u WHERE u.id='${[id]}'`
  );
  if (potentialAdmin.rowCount > 0) {
    if (potentialAdmin.rows[0].admin) {
      next(req, res);
      return 0;
    } else {
      res.status(400).json({
        success: false,
        status: 400,
        error: 'Nieupoważnionym wstęp wzbroniony'
      });
      return 0;
    }
  } else {
    res.status(400).json({
      success: false,
      status: 400,
      error: 'Nieupoważnionym wstęp wzbroniony'
    });
    return 0;
  }
};

module.exports = { authorizeAdmin, checkIfAdmin };
