const pool = require('../../../../db');
const userCSV = require('../../../../schema/adminSchema');
const papa = require('papaparse');
const addMultipleUsers = require('../../../../utils/addMultipleUsers');

const importUsersCSV = async (req, res) => {
  await userCSV
    .validate(message)
    .catch(err => {
      res.status(400).json({
        success: false,
        status: 400,
        error: 'Nieprawidłowy format zapytania',
        errorDetails: err
      });
    })
    .then(async valid => {
      if (valid.deleteUsers) {
        await pool.query('DELETE FROM users_has_questions WHERE users_id!=$1', [
          socket.user.id
        ]);
        await pool.query('DELETE FROM users WHERE id!=$1', [socket.user.id]);
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
          res.status(200).json(result);
        });
      } catch (e) {
        res.status(406).json({
          success: false,
          status: 406,
          error: 'Wystąpił problem z odczytywaniem CSV',
          errorDetails: e
        });
      }
    });
};

module.exports = importUsersCSV;
