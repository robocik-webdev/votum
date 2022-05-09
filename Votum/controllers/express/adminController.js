const utility = require('./admin/utilityController');
const users = require('./admin/usersController');
const questions = require('./admin/questionsController');
const { authorizeAdmin, checkIfAdmin } = require('./admin/authorizeAdmin');
// const answers = require('./admin/answersController');

const admin = { utility, users, questions, authorizeAdmin, checkIfAdmin };

module.exports = admin;
