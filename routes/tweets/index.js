const router = require('express').Router();
const auth = require('../../middleware/auth');
const tweetController = require('../../controllers/tweetController');

router.use('/like', require('./like'));
router.use('/comment', require('./comment'));

/*
  @route   GET api/tweets/all
  @desc    Get all tweets
  @access  Public
 */
router.get('/all', tweetController.getTweets);

/*
  @route   GET api/tweets/all/:user_id
  @desc    Get all tweets posted by the user
  @access  Public
 */
router.get('/all/:user_id', tweetController.getUserTweets);

/*
  @route   GET api/tweets/homepageTweets
  @desc    Get all profile's homepageTweets
  @access  Private
 */
router.get('/homepageTweets', auth, tweetController.getProfilesHomepageTweets);

/*
  @route   GET api/tweets/:tweet_id
  @desc    Get tweet by tweet ID
  @access  Public
 */
router.get('/:tweet_id', tweetController.getTweetById);

/*
  @route   POST api/tweets
   @desc    Create tweet
  @access  Private
 */
router.post('/', auth, tweetController.validate('createTweet'), tweetController.createTweet);

/*
  @route   PUT api/tweets/:tweet_id
  @desc    Update tweet (only by tweet author)
  @access  Private
 */
router.put('/:tweet_id', auth, tweetController.validate('updateTweet'), tweetController.updateTweet);

/*
  @route   DELETE api/tweets/:tweet_id
  @desc    Delete tweet
  @access  Private
 */
router.delete('/:tweet_id', auth, tweetController.deleteTweet);

module.exports = router;
