const pool = require('../../../../db');
const ioAdminUsers = require('../../../socketController').adminUsers;

let fs = require('fs');

const seedDatabase = async (req, res) => {
  var path = process.cwd() + '/sql/seed.sql';
  var sql = fs.readFileSync(path).toString();
  pool.query(sql, [], (err, result) => {
    if (err) {
      res.status(400).json({
        success: false,
        status: 400,
        error: 'Nie udało się wygenerować nowej bazy danych.',
        errorDetails: err
      });
    } else {
      res.status(200).json({ success: true, status: 200 });
      ioAdminUsers(req.app.get('io'));
    }
  });
};

module.exports = seedDatabase;