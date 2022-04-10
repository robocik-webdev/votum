const newAnswer = require('./admin/newAnswer');
const newUser = require('./admin/newUser');
const newQuestion = require('./admin/newQuestion');
const modifyAnswer = require('./admin/modifyAnswer');
const modifyUser = require('./admin/modifyUser');
const modifyQuestion = require('./admin/modifyQuestion');
const userCSV = require('./admin/userCSV');
const idValidation = require('./idValidation');
const userPrivilage = require('./admin/userPrivilage');
const questionShowAnswers = require('./admin/questionShowAnswers');

module.exports = {
  newAnswer,
  newUser,
  newQuestion,
  modifyAnswer,
  modifyUser,
  modifyQuestion,
  userCSV,
  userPrivilage,
  questionShowAnswers,
  idValidation
};
