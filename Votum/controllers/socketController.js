const initializeUser = require('./socket/initializeUser');
const authorizeUser = require('./socket/authorizeUser');
const questions = require('./socket/questions');
const openQuestion = require('./socket/openQuestion');
const getCurrentUser = require('./socket/getCurrentUser');
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
  adminRegenUserToken,
  adminRegenAllUserTokens,
  adminImportUsers,
  adminSeedDatabase
} = require('./socket/admin');

module.exports = {
  initializeUser,
  authorizeUser,
  getCurrentUser,
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
  adminRegenUserToken,
  adminRegenAllUserTokens,
  adminImportUsers,
  adminSeedDatabase
};
