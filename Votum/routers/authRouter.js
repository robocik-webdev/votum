const express = require('express');
const router = express.Router();
const {
  handleLogin,
  attemptLogin,
  validateLogin
} = require('../controllers/express/login');

router.route('/login').get(handleLogin).post(validateLogin, attemptLogin);

module.exports = router;
