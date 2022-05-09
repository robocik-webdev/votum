const idValidation = require('../../../../schema/adminSchema');
const regenUserToken = require('../../../../utils/regenUserToken');

const regenToken = async (req, res) => {
  idValidation
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
        regenUserToken(message.id).then(err => {
          if (err) {
            res.status(400).json({
              success: false,
              status: 400,
              error: 'Nie udało się zmienić użytkownikowi tokenu',
              errorDetails: err
            });
          } else {
            res.status(200).json({ success: true, status: 200 });
          }
        });
      } else {
        res
          .status(400)
          .json({
            success: true,
            status: 400,
            error: 'Nieprawidłowe zapytanie'
          });
      }
    });
};

module.exports = regenToken;
