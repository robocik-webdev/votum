const utility = require('./admin/utilityController');
const users = require('./admin/usersController');
const questions = require('./admin/questionsController');
const authorizeAdmin = require('./admin/authorizeAdmin');
// const answers = require('./admin/answersController');

const admin = { utility, users, questions, authorizeAdmin };

module.exports = admin;
