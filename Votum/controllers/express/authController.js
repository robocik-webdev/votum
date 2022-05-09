const login = require('./auth/login');
const logout = require('./auth/logout');
const me = require('./auth/me');

const auth = { login, logout, me };

module.exports = auth;
