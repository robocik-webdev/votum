const pool = require('../../../../db');
const regenUserToken = require('../../../../utils/regenUserToken');
const ioAdminUsers = require('../../../socketController').adminUsers;

const regenAllTokens = async (req, res) => {
  var x = 0;
  ids = await pool.query('SELECT id FROM users', async (err, results) => {
    for (const element of results.rows) {
      const err = await regenUserToken(element.id);
      if (err) {
        x++;
      }
    }
    if (x > 0) {
      res.status(400).json({
        success: false,
        status: 400,
        error: 'Nie udało się zmienić tokeny użytkownikom',
        errorDetails: err
      });
    } else {
      res.status(200).json({ success: true, status: 200 });
      ioAdminUsers(req.app.get('io'));
    }
  });
};

module.exports = regenAllTokens;
