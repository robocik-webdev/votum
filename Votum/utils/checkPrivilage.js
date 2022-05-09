const pool = require('../db');

const checkPrivilage = async (userID, questionID) => {
  const privilage = await pool.query(
    `SELECT right_to_vote FROM users WHERE id=$1`,
    [userID]
  );
  if (privilage.rowCount > 0 && privilage.rows[0].rightToVote) {
    const voted = await pool.query(
      `SELECT id FROM users_has_questions WHERE users_id=$1 AND questions_id=$2`,
      [userID, questionID]
    );
    if (voted.rowCount == 0) {
      return true;
    }
  }
  return false;
};

module.exports = checkPrivilage;
