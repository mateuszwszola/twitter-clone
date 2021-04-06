const router = require('express').Router();
const auth = require('../../middleware/auth');
const userController = require('./userController');

/**
 * @route   GET api/users
 * @desc    Return authenticated user
 * @access  Private
 */
router.get('/', auth, userController.getUser);

module.exports = router;
