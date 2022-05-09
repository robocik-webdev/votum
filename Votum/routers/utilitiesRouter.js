const express = require('express');
const router = express.Router({ mergeParams: true });

router.route('/utilities');
router.get('/test', (req, res) => {
  res.send('test');
});
router.get('/utilities/test2', (req, res) => {
  res.send('test2');
});

module.exports = router;
