const router = require('express').Router();
const auth = require('../../middleware/auth');
const tweetController = require('../../controllers/tweetController');

/*
  @route   GET api/tweets/like/:user_id
  @desc    Get list of profile's likes (tweets)
  @access  Public
 */
router.get('/:user_id', tweetController.getProfileLikes);

/*
  @route   POST api/tweets/like/:tweet_id
  @desc    Like or unlike tweet
  @access  Private
 */
router.post('/:tweet_id', auth, tweetController.toggleTweetLike);

module.exports = router;
