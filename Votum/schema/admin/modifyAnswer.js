const Yup = require('yup');

const modifyAnswer = Yup.object({
  id: Yup.number('This value needs to be a number')
    .required('id is required')
    .positive()
    .integer(),
  title: Yup.string()
    .required('Answer text required')
    .min(1, 'Answer text too short'),
  answers: Yup.array().of(Yup.string()).ensure()
});
module.exports = modifyAnswer;
