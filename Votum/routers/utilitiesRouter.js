const express = require('express');
const { route } = require('./usersRouter');
const router = express.Router({ mergeParams: true });

const controllers = require('../controllers/expressController').controllers;

const authorizeAdmin = controllers.admin.authorizeAdmin;
const adminUtils = controllers.admin.utility;

router.post('/utilities/importCSV', (req, res) => {
  authorizeAdmin(req, res, adminUtils.importUsersCSV);
});
router.patch('/utilities/regenAllTokens', (req, res) => {
  authorizeAdmin(req, res, adminUtils.regenAllTokens);
});
router.post('/utilities/seedDB', (req, res) => {
  authorizeAdmin(req, res, adminUtils.seedDatabase);
});

module.exports = router;
