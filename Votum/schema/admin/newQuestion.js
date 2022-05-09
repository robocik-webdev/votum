const Yup = require('yup');

const newQuestion = Yup.object({
  title: Yup.string()
    .required('Question required')
    .min(1, 'Question too short'),
  maxAnswers: Yup.number()
    .required('Maximum possible answers required')
    .positive()
    .integer(),
  showResults: Yup.boolean().required(
    'You need to specify whether or not to show answers of this poll'
  ),
  timeOpen: Yup.date().required('Open time required'),
  timeClose: Yup.date().required('Close time is required'),
  answers: Yup.array().of(Yup.string()).ensure()
});
module.exports = newQuestion;
