const idValidation = require('../../../../schema/idValidation');
const ioAdminUsers = require('../../../socketController').adminUsers;
const regenUserToken = require('../../../../utils/regenUserToken');

const regenToken = async (req, res) => {
  idValidation
    .validate(req.params)
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
        regenUserToken(valid.id).then(err => {
          if (err) {
            res.status(400).json({
              success: false,
              status: 400,
              error: 'Nie udało się zmienić użytkownikowi tokenu',
              errorDetails: err
            });
          } else {
            res.status(200).json({ success: true, status: 200 });
            ioAdminUsers(req.app.get('io'));
          }
        });
      }
    });
};

module.exports = regenToken;
