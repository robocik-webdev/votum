const pool = require('../db');

const availableQuestions = async () => {
  const closedQuestions = await pool.query(
    `SELECT id, time_open, time_close FROM questions where time_open < (now() + '1 hour'::interval) AND time_open > now();`
  );
  const openQuestions = await pool.query(
    `SELECT * FROM questions WHERE time_open <= now() AND time_close > now();`
  );
  const finishedQuestions = await pool.query(
    `SELECT * FROM questions WHERE time_open <= now() AND time_close <= now() AND show_results=true;`
  );

  return {
    closedQuestions: closedQuestions.rows,
    openQuestions: openQuestions.rows,
    finishedQuestions: finishedQuestions.rows
  };
};

module.exports = availableQuestions;
