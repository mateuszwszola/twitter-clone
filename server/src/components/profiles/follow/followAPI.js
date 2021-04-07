const router = require('express').Router();
const { authenticate } = require('../../../middleware/auth');
const followController = require('./followController');

/*
  @route   GET api/profiles/follow/:user_id/followers
  @desc    Get profile list of followers profiles
  @access  Public
 */
router.get(
  '/follow/:user_id/followers',
  followController.getProfileFollowersList
);

/*
  @route   GET api/profiles/follow/:user_id/following
  @desc    Get profile list of following profiles
  @access  Public
 */
router.get(
  '/follow/:user_id/following',
  followController.getProfileFollowingList
);

/*
  @route   POST api/profiles/follow/:user_id
  @desc    Follow a user
  @access  Private
 */
router.post(
  '/follow/:user_id',
  authenticate,
  followController.validate('followUser'),
  followController.followUser
);

/*
  @route   POST api/profiles/unfollow/:user_id
  @desc    Unfollow a user
  @access  Private
 */
router.post(
  '/unfollow/:user_id',
  authenticate,
  followController.validate('unfollowUser'),
  followController.unfollowUser
);

module.exports = router;
