const pool = require('../../../../db');
const { userPrivilage } = require('../../../../schema/adminSchema');
const ioAdminUsers = require('../../../socketController').adminUsers;

const privilageUser = async (req, res) => {
  let message = req.body;
  message.id = req.params.id;
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
          [valid.rightToVote, valid.id],
          (err, result) => {
            if (err) {
              socket.emit('adminSetUserPrivilage', {
                success: false,
                status: 406,
                error: 'Nie udało się ustawić przywilejów do głosowania',
                errorDetails: err
              });
            } else {
              res.status(200).json({ success: true, status: 200 });
              ioAdminUsers(req.app.get('io'));
            }
          }
        );
      }
    });
};

module.exports = privilageUser;
