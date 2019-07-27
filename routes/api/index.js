// @route   /api
const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/profiles', require('./profiles'));
router.use('/tweets', require('./tweets'));

module.exports = router;
