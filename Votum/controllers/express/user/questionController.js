const { getQuestions, getQuestion } = require('./questions/get');
const openQuestion = require('./questions/open');
const vote = require('./questions/vote');

const questions = { getQuestions, getQuestion, openQuestion, vote };

module.exports = questions;
