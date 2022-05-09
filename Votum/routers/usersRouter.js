const express = require('express');
const router = express.Router({ mergeParams: true });
const controllers = require('../controllers/expressController').controllers;

const authorizeAdmin = controllers.admin.authorizeAdmin;
const adminUsers = controllers.admin.users;

router
  .route('/users')
  .post((req, res) => {
    authorizeAdmin(req, res, (req, res) => {
      res.json({ yes: 'yes' });
    });
  })
  .get((req, res) => {
    authorizeAdmin(req, res, adminUsers.getUsers);
  });

router.route('/users/:id').post((req, res) => {
  res.json(req.params.id);
});

module.exports = router;
