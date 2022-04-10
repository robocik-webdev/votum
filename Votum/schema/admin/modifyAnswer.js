const Yup = require('yup');

const newAnswer = Yup.object({
  id: Yup.number('This value needs to be a number')
    .required('id is required')
    .positive()
    .integer(),
  answer: Yup.string()
    .required('Answer text required')
    .min(1, 'Answer text too short')
});
module.exports = newAnswer;
