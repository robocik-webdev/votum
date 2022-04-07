const pool = require("../../db");

const getPolls = async (socket) => {
    const availablePolls = await pool.query(
        `SELECT * FROM questions`
      );
    socket.to("votum").emit({status:"open",questions:availablePolls});
}
module.exports = getPolls