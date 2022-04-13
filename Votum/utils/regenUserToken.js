const pool = require('../db');
const makeToken = require('./makeToken');

const regenUserToken = async (id, token = makeToken(8)) => {
  pool.query(
    `UPDATE users SET token=$1 WHERE id=$2`,
    [token, id],
    async (err, res) => {
      if (err) {
        console.log(err);
        return err;
      } else {
        return undefined;
      }
    }
  );
};

module.exports = regenUserToken;
