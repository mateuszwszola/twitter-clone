const router = require('express').Router();
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const tweetController = require('./tweet.controller');
const tweetValidation = require('./tweet.validation');

router
  .route('/')
  .get(validate(tweetValidation.getTweets), tweetController.getTweets)
  .post(
    auth(),
    validate(tweetValidation.createTweet),
    tweetController.createTweet
  );

router
  .route('/:tweetId')
  .get(validate(tweetValidation.getTweet), tweetController.getTweet)
  .patch(
    auth(),
    validate(tweetValidation.updateTweet),
    tweetController.updateTweet
  )
  .delete(
    auth(),
    validate(tweetValidation.deleteTweet),
    tweetController.deleteTweet
  );

module.exports = router;
