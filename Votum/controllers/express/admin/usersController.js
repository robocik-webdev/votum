const addUser = require('./users/add');
const deleteUser = require(`./users/delete`);
const editUser = require('./users/edit');
const regenToken = require('./users/regenToken');
const privilageUser = require('./users/setPrivilage');
const getUsers = require('./users/get');

const users = {
  addUser,
  deleteUser,
  editUser,
  regenToken,
  privilageUser,
  getUsers
};

module.exports = users;
