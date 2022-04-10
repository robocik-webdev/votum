const initializeUser = require('./socket/initializeUser');
const authorizeUser = require('./socket/authorizeUser');
const questions = require('./socket/questions');
const openQuestion = require('./socket/openQuestion');
const vote = require('./socket/vote');
const {
  adminRefresh,
  authorizeAdmin,
  adminQuestions,
  adminUsers,
  adminAddAnswer,
  adminModifyAnswer,
  adminRemoveAnswer,
  adminAddQuestion,
  adminModifyQuestnion,
  adminRemoveQuestion,
  adminSetQuestionShowAnswers,
  adminAddUser,
  adminModifyUser,
  adminRemoveUser,
  adminSetUserPrivilage,
  adminImportUsers
} = require('./socket/admin');

module.exports = {
  initializeUser,
  authorizeUser,
  questions,
  openQuestion,
  vote,
  adminRefresh,
  authorizeAdmin,
  adminQuestions,
  adminUsers,
  adminAddAnswer,
  adminModifyAnswer,
  adminRemoveAnswer,
  adminAddQuestion,
  adminModifyQuestnion,
  adminRemoveQuestion,
  adminSetQuestionShowAnswers,
  adminAddUser,
  adminModifyUser,
  adminRemoveUser,
  adminSetUserPrivilage,
  adminImportUsers
};
