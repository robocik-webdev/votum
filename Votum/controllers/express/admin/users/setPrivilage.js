const pool = require('../../../../db');
const userPrivilage = require('../../../../schema/adminSchema');

const privilageUser = async (req, res) => {
  userPrivilage
    .validate(message)
    .catch(err => {
      res.status(400).json({
        success: false,
        status: 400,
        error: 'Nieprawidłowy format zapytania',
        errorDetails: err
      });
    })
    .then(valid => {
      if (valid) {
        pool.query(
          'UPDATE users SET right_to_vote=$1 where id=$2',
          [message.rightToVote, message.id],
          (err, result) => {
            if (err) {
              socket.emit('adminSetUserPrivilage', {
                status: 406,
                data: { error: err }
              });
            } else {
              res.status(200).json({ success: true, status: 200 });
            }
          }
        );
      } else {
        res.status(400).json({
          success: false,
          status: 400,
          error: 'Nieprawidłowe zapytanie'
        });
      }
    });
};

module.exports = privilageUser;
