const pool = require('../db');
const makeToken = require('./makeToken');
const ioAdminUsers = require('../controllers/socket/admin').adminUsers;

const addMultipleUsers = async users => {
  var p = new Promise(async res => {
    var errCount = 0;
    var errReason = [];
    var promises = [];

    for (const user of users) {
      promises.push(
        pool
          .query(
            'INSERT INTO users (name, surname, email, right_to_vote, admin, token) VALUES($1,$2,$3,$4,$5,$6)',
            [
              user.name,
              user.surname,
              user.email,
              user.rightToVote,
              user.admin,
              makeToken(8)
            ]
          )
          .catch(err => {
            errCount++;
            errReason.push(err);
          })
      );
    }
    Promise.all(promises).then(() => {
      if (errCount == 0) {
        res({
          success: true,
          status: 200,
          data: { addedUsers: promises.length }
        });
      } else {
        res({
          success: false,
          status: 300,
          error: 'Nie udało się dodać wszystkich rekordów',
          errorDetails: errReason,
          data: {
            addedUsers: promises.length - errCount
          }
        });
      }
    });
  });
  return p;
};

module.exports = addMultipleUsers;
