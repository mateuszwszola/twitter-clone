const router = require('express').Router();
const { authenticate } = require('../../middleware/auth');
const profileController = require('./profileController');
const { followAPI } = require('./follow');
const validate = require('./validate');

router.use('/', followAPI);

/**
 *  @route   GET api/profiles
 *  @desc    Get logged-in user profile
 *  @access  User
 */
router.get('/', authenticate, profileController.getUserProfile);

/**
 * @route   GET api/profiles
 * @desc    Get profiles
 * @access  Public
 */
router.get('/all', profileController.getProfiles);

/**
 * @route   POST api/profiles
 * @desc    Update user profile
 * @access  User
 */
router.post(
  '/',
  authenticate,
  validate.validateProfile(),
  profileController.updateProfile
);

module.exports = router;
