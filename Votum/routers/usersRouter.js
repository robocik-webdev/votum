const express = require('express');
const router = express.Router({ mergeParams: true });

router.route('/users').get(() => {
  console.log('test');
});
router.route('/users/:id').post((req, res) => {
  res.json(req.params.id);
});

module.exports = router;
