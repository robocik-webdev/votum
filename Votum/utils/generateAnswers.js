const pool = require('../db');

const generateAnswers = async (answers, questionID) => {
  var p = new Promise(async res => {
    var errCount = 0;
    var errReason = [];
    var promises = [];
    pool.query();
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
          status: 200,
          data: { addedUsers: promises.length }
        });
      } else {
        res({
          status: 300,
          data: {
            addedUsers: promises.length - errCount,
            errorCount: errCount,
            errors: errReason
          }
        });
      }
    });
  });
  return p;
};

module.exports = generateAnswers;
