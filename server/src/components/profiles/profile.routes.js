const router = require('express').Router();
const profileController = require('./profile.controller');
const profileValidation = require('./profile.validation');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');

/**
 *  @route   GET api/profiles
 *  @desc    Get all profiles
 *  @access  Public
 */
router.get(
  '/',
  validate(profileValidation.getProfiles),
  profileController.getProfiles
);

/**
 * @route   GET api/profiles/:userId
 * @desc    Get user's profile
 * @access  Public
 */
router.get(
  '/:userId',
  validate(profileValidation.getProfile),
  profileController.getProfile
);

/**
 * @route   PUT api/profiles/:userId
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
