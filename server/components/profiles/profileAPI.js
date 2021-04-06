const router = require('express').Router();
const auth = require('../../middleware/auth');
const profileController = require('./profileController');
const { followAPI } = require('./follow');

router.use('/', followAPI);

/*
  @route   GET api/profiles/
  @desc    Get logged in user profile
  @access  Private
 */
router.get('/', auth, profileController.getLoggedInUserProfile);

/*
  @route   GET api/profiles/homepageTweets
  @desc    Get logged in user profile with tweets to display on the homepage
  @access  Private
 */
router.get(
  '/homepageTweets',
  auth,
  profileController.getLoggedInUserProfileWithHomepageTweets
);

/*
  @route   GET api/profiles/tweets
  @desc    Get logged in user profile with tweets
  @access  Private
 */
router.get('/tweets', auth, profileController.getLoggedInUserProfileWithTweets);

/*
  @route   GET api/profiles/all
  @desc    Get all profiles
  @access  Public
*/
router.get('/all', profileController.getAllProfiles);

/*
  @route   GET api/profiles/:user_id
  @desc    Get profile by user ID
  @access  Public
 */
router.get('/:user_id', profileController.getProfileByUserId);

/*
  @route   GET api/profiles/username/:username
  @desc    Get profile by username
  @access  Public
 */
router.get('/username/:username', profileController.getProfileByUsername);

/*
  @route   GET api/profiles/username/:username/tweets
  @desc    Get profile by username with tweets
  @access  Public
 */
router.get(
  '/username/:username/tweets',
  profileController.getProfileByUsernameWithTweets
);

/*
  @route   POST api/profiles
  @desc    Update user PROFILE
  @access  Private
 */
router.post(
  '/',
  auth,
  profileController.validate('updateProfile'),
  profileController.updateProfile
);

/*
  @route   DELETE api/profiles
  @desc    Delete user account (profile and user)
  @access  Private
 */
router.delete('/', auth, profileController.deleteAccount);

/*
  @route   GET api/profiles/homepageTweets/all
  @desc    Get all tweets from profile.homepageTweets to display them in the profile homepage
  @access  Private
 */
router.get('/homepageTweets/all', auth, profileController.getHomepageTweets);

module.exports = router;
