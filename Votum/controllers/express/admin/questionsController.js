const addQuestion = require('./questions/add');
const deleteQuestion = require('./questions/delete');
const editQuestion = require('./questions/edit');
const setShowResults = require('./questions/setShowResults');

const questions = { addQuestion, deleteQuestion, editQuestion, setShowResults };

module.exports = questions;
