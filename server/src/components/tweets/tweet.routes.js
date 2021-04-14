const router = require('express').Router();
const auth = require('../../middleware/auth');
const tweetController = require('./tweet.controller');
const tweetValidation = require('./tweet.validation');

router
  .route('/')
  .get(tweetValidation.getTweets, tweetController.getTweets)
  .post(auth(), tweetValidation.createTweet, tweetController.createTweet);

router
  .route('/:tweetId')
  .get(tweetValidation.getTweet, tweetController.getTweet)
  .patch(auth(), tweetValidation.updateTweet, tweetController.updateTweet)
  .delete(auth(), tweetValidation.deleteTweet, tweetController.deleteTweet);

module.exports = router;
