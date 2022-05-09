const addQuestion = require('./questions/add');
const deleteQuestion = require('./questions/delete');
const editQuestion = require('./questions/edit');
const setShowResults = require('./questions/setShowResults');
const { getQuestions, getQuestion } = require('./questions/get');

const questions = {
  addQuestion,
  deleteQuestion,
  editQuestion,
  setShowResults,
  getQuestions,
  getQuestion
};

module.exports = questions;
