const Yup = require('yup');

const newAnswer = Yup.object({
  title: Yup.string()
    .required('Answer text required')
    .min(1, 'Answer text too short'),
  questionId: Yup.number()
    .required('Need question id to connect to it')
    .positive()
    .integer()
});
module.exports = newAnswer;
