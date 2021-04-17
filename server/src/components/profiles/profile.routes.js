const router = require('express').Router();
const profileController = require('./profile.controller');
const profileValidation = require('./profile.validation');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');

/**
 * @route   POST / DELETE api/profiles/follow/:userId
 * @desc    Follow / unfollow profile
 * @access  User
 */
router
  .route('/follow/:userId')
  .post(auth(), validate(profileValidation.getProfile), profileController.followProfile)
  .delete(auth(), validate(profileValidation.getProfile), profileController.unfollowProfile);

/**
 *  @route   GET api/profiles
 *  @desc    Get profiles
 *  @access  Public
 */
router.get('/', validate(profileValidation.getProfiles), profileController.getProfiles);

/**
 * @route   GET api/profiles/:userId
 * @desc    Get user's profile
 * @access  Public
 */
router.get('/:userId', validate(profileValidation.getProfile), profileController.getProfile);

/**
 * @route   PATCH api/profiles/:userId
 * @desc    Update user's profile
 * @access  Owner, Admin
 */
router.patch(
  '/:userId',
  auth('manageUsers'),
  validate(profileValidation.updateProfile),
  profileController.updateProfile
);

module.exports = router;
