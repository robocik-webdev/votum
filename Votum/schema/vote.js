const Yup = require('yup');

const voteValidation = Yup.object({
  id: Yup.number('This value needs to be a number')
    .required('id is required')
    .positive()
    .integer(),
  answers: Yup.array()
    .of(Yup.number())
    .ensure()
    .required('Answers id array required')
});
module.exports = voteValidation;
