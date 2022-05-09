const pool = require('../../../../db');
const { userCSV } = require('../../../../schema/adminSchema');
const papa = require('papaparse');
const addMultipleUsers = require('../../../../utils/addMultipleUsers');
const ioAdminUsers = require('../../../socketController').adminUsers;

const importUsersCSV = async (req, res) => {
  await userCSV
    .validate(req.body)
    .catch(err => {
      res.status(400).json({
        success: false,
        status: 400,
        error: 'Nieprawidłowy format zapytania',
        errorDetails: err
      });
    })
    .then(async valid => {
      if (valid) {
        if (valid.deleteUsers) {
          await pool.query(
            'DELETE FROM users_has_questions WHERE users_id!=$1',
            [req.session.userID]
          );
          await pool.query('DELETE FROM users WHERE id!=$1', [
            req.session.userID
          ]);
        }
        var parsedCSV = [];
        if (valid.head) {
          parsedCSV = papa.parse(valid.csv, {
            header: true
          });
        } else {
          parsedCSV = papa.parse(
            'name,surname,email,rightToVote,admin\n' + valid.csv,
            {
              header: true
            }
          );
        }
        var i = 0;
        try {
          var data = Array.from(parsedCSV.data);
          for (const elem of data) {
            data[i].rightToVote = JSON.parse(elem.rightToVote);
            data[i].admin = JSON.parse(elem.admin);
            i++;
          }
          addMultipleUsers(data).then(result => {
            res.status(result.status).json(result);
            ioAdminUsers(req.app.get('io'));
          });
        } catch (e) {
          res.status(406).json({
            success: false,
            status: 406,
            error: 'Wystąpił problem z odczytywaniem CSV',
            errorDetails: e
          });
        }
      }
    });
};

module.exports = importUsersCSV;
