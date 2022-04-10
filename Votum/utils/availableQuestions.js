const pool = require('../db');

const availableQuestions = async () => {
  const closedQuestions = await pool.query(
    `SELECT id, open_time, close_time FROM questions where open_time < (now() + '1 hour'::interval) AND open_time > now();`
  );
  const openQuestions = await pool.query(
    `SELECT * FROM questions WHERE open_time <= now() AND close_time > now();`
  );
  const finishedQuestions = await pool.query(
    `SELECT * FROM questions WHERE open_time <= now() AND close_time <= now();`
  );

  return {
    closedQuestions: closedQuestions.rows,
    openQuestions: openQuestions.rows,
    finishedQuestions: finishedQuestions.rows
  };
};

module.exports = availableQuestions;
