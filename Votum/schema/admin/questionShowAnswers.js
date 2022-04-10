const Yup = require('yup');

const questionShowAnswers = Yup.object({
  id: Yup.number('This value needs to be a number')
    .required('id is required')
    .positive()
    .integer(),
  showAnswers: Yup.boolean('This value needs to be a boolean').required(
    'Right to vote status is required'
  )
});
module.exports = questionShowAnswers;
