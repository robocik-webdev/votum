const initializeUser = require('./socket/initializeUser');
const authorizeUser = require('./socket/authorizeUser');
const questions = require('./socket/questions');
const openQuestion = require('./socket/openQuestion');
const vote = require('./socket/vote');
const {
  authorizeAdmin,
  adminQuestions,
  adminUsers,
  adminAddAnswer,
  adminRemoveAnswer,
  adminAddQuestion,
  adminRemoveQuestion,
  adminAddUser,
  adminModifyUser,
  adminRemoveUser,
  adminModifyQuestnion,
  adminImportUsers
} = require('./socket/admin');

module.exports = {
  authorizeAdmin,
  initializeUser,
  authorizeUser,
  questions,
  openQuestion,
  vote,
  adminQuestions,
  adminUsers,
  adminAddAnswer,
  adminRemoveAnswer,
  adminAddQuestion,
  adminRemoveQuestion,
  adminAddUser,
  adminModifyUser,
  adminRemoveUser,
  adminModifyQuestnion,
  adminImportUsers
};
