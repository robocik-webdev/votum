const Yup = require('yup');

const modifyQuestion = Yup.object({
  id: Yup.number('This value needs to be a number')
    .required('id is required')
    .positive()
    .integer(),
  question: Yup.string()
    .required('Question required')
    .min(1, 'Question too short'),
  possibleAnswers: Yup.number()
    .required('Maximum possible answers required')
    .positive()
    .integer(),
  openTime: Yup.date().required('Open time required'),
  closeTime: Yup.date().required('Close time is required')
});
module.exports = modifyQuestion;
