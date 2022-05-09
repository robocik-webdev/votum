const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../controllers/expressController').controllers.auth;

router.route('/login').post((req, res) => {
  auth.login(req, res);
});

router.route('/logout').get((req, res) => {
  auth.logout(req, res);
});

router.route('/me').get((req, res) => {
  auth.me(req, res);
});

module.exports = router;
