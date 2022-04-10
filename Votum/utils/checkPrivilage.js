const pool = require('../db');

const checkPrivilage = async (user, questionID) => {
  const privilage = await pool.query(
    `SELECT righttovote FROM users WHERE id=$1`,
    [user.id]
  );
  console.log(user.id);
  if (privilage.rowCount == 1 && privilage.rows[0].righttovote == true) {
    const voted = await pool.query(
      `SELECT id FROM users_has_questions WHERE users_id=$1 AND questions_id=$2`,
      [user.id, questionID]
    );
    console.log(voted.rowCount);
    console.log(voted.rows.length);
    if (voted.rowCount == 0) {
      return true;
    }
  }
  return false;
};

module.exports = checkPrivilage;
