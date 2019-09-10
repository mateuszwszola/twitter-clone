const router = require('express').Router();
const auth = require('../../middleware/auth');
const commentController = require('../../controllers/commentController');
const { validate } = require('../../controllers/tweetController');

/*
    @route GET api/tweets/comment/:tweet_id/all
    @desc Get all tweet comments
    @access Public
 */
router.get('/:tweet_id/all', commentController.getComments);

/*
  @route   POST api/tweets/comment/:tweet_id
  @desc    Comment another tweet (create new tweet and add it's ID to tweet that is commented)
  @access  Private
 */
router.post('/:tweet_id', auth, validate('createTweet'), commentController.createComment);

module.exports = router;
