const Yup = require('yup');

const newQuestion = Yup.object({
  title: Yup.string()
    .required('Question required')
    .min(1, 'Question too short'),
  possibleAnswers: Yup.number()
    .required('Maximum possible answers required')
    .positive()
    .integer(),
  showAnswers: Yup.boolean().required(
    'You need to specify whether or not to show answers of this poll'
  ),
  openTime: Yup.date().required('Open time required'),
  closeTime: Yup.date().required('Close time is required'),
  answers: Yup.array().of(Yup.string()).ensure()
});
module.exports = newQuestion;
