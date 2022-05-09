const importUsersCSV = require('./utility/importUsersCSV');
const regenAllTokens = require('./utility/regenAllTokens');
const seedDatabase = require('./utility/seedDB');

const utility = { importUsersCSV, regenAllTokens, seedDatabase };

module.exports = utility;
