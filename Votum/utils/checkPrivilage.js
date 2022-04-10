const pool = require('../db');

const checkPrivilage = async (user, questionID) => {
  const privilage = await pool.query(
    `SELECT right_to_vote FROM users WHERE id=$1`,
    [user.id]
  );
  if (privilage.rowCount == 1 && privilage.rows[0].right_to_vote == true) {
    const voted = await pool.query(
      `SELECT id FROM users_has_questions WHERE users_id=$1 AND questions_id=$2`,
      [user.id, questionID]
    );
    if (voted.rowCount == 0) {
      return true;
    }
  }
  return false;
};

module.exports = checkPrivilage;
