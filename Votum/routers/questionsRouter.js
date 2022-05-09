const express = require('express');
const router = express.Router({ mergeParams: true });

router.route('/questions').get(() => {
  console.log('test');
});
router.route('/questions/:id').post((req, res) => {
  res.json(req.body);
});

router.patch('/questions/:id/showResults', (req, res) => {
  res.json(req.params);
});

module.exports = router;
