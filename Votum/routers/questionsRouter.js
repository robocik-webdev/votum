const express = require('express');
const router = express.Router({ mergeParams: true });

const controllers = require('../controllers/expressController').controllers;

const { authorizeAdmin, checkIfAdmin } = controllers.admin;
const adminQuestions = controllers.admin.questions;
const userQuestions = controllers.user.questions;

router
  .route('/questions')
  .get(async (req, res) => {
    checkIfAdmin(req).then(result => {
      if (result.admin) {
        adminQuestions.getQuestions(req, res);
      } else {
        userQuestions.getQuestions(req, res);
      }
    });
  })
  .post(async (req, res) => {
    authorizeAdmin(req, res, adminQuestions.addQuestion);
  });
router
  .route('/questions/:id')
  .get((req, res) => {
    checkIfAdmin(req).then(result => {
      if (result.admin) {
        adminQuestions.getQuestion(req, res);
      } else {
        userQuestions.getQuestion(req, res);
      }
    });
  })
  .put((req, res) => {
    authorizeAdmin(req, res, adminQuestions.editQuestion);
  })
  .delete((req, res) => {
    authorizeAdmin(req, res, adminQuestions.deleteQuestion);
  });

router.patch('/questions/:id/showResults', (req, res) => {
  authorizeAdmin(req, res, adminQuestions.setShowResults);
});

router.get('/questions/:id/open', (req, res) => {
  userQuestions.openQuestion(req, res);
});

router.post('/questions/:id/vote', (req, res) => {
  userQuestions.vote(req, res);
});

module.exports = router;
