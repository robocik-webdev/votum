const express = require('express');
const admin = require('../controllers/express/adminController');
const router = express.Router({ mergeParams: true });
const controllers = require('../controllers/expressController').controllers;

const authorizeAdmin = controllers.admin.authorizeAdmin;
const adminUsers = controllers.admin.users;

router.route('/users').post((req, res) => {
  authorizeAdmin(req, res, adminUsers.addUser);
});
router.route('/users').get((req, res) => {
  authorizeAdmin(req, res, adminUsers.getUsers);
});

router
  .route('/users/:id')
  .post((req, res) => {
    res.json(req.params.id);
  })
  .delete((req, res) => {
    authorizeAdmin(req, res, adminUsers.deleteUser);
  })
  .put((req, res) => {
    authorizeAdmin(req, res, adminUsers.editUser);
  })
  .get((req, res) => {
    authorizeAdmin(req, res, adminUsers.getUser);
  });
router.route('/users/:id/rightToVote').patch((req, res) => {
  authorizeAdmin(req, res, adminUsers.privilageUser);
});
router.route('/users/:id/regenToken').patch((req, res) => {
  authorizeAdmin(req, res, adminUsers.regenToken);
});
module.exports = router;
