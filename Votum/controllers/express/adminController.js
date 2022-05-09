const utility = require('./admin/utilityController');
const users = require('./admin/usersController');
const questions = require('./admin/questionsController');
// const answers = require('./admin/answersController');

const admin = { utility, users, questions };

module.exports = admin;
