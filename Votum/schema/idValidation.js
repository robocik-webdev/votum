const Yup = require('yup');

const idValidation = Yup.object({
  id: Yup.number('This value needs to be a number')
    .required('id is required')
    .positive()
    .integer()
});
module.exports = idValidation;
