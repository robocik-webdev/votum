const auth = require('./express/authController');
const admin = require('./express/adminController');
const controllers = { auth, admin };
module.exports = { controllers };
