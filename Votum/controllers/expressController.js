const auth = require('./express/authController');
const admin = require('./express/adminController');
const user = require('./express/userController');

const controllers = { auth, admin, user };
module.exports = { controllers };
