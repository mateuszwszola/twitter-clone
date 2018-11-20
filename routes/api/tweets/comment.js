const express = require('express');
const router = express.Router();
const passport = require('passport');
const Tweet = require('../../../models/Tweet');

// Load validation functions
const validateObjectId = require('../../../validation/objectId');
const validateTweet = require('../../../validation/createTweet');

// @route   POST api/tweets/comment/:tweet_id
// @desc    Comment another tweet (create new tweet and add it's ID to tweet that is commented)
// @access  Private
router.post(
  '/:tweet_id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    // Validate tweet id param
    const { tweet_id } = req.params;
    const { idErrors, isValidObjectId } = validateObjectId(tweet_id);

    if (!isValidObjectId) {
      return res.status(400).json(idErrors);
    }

    // Validate req.body (tweet content - text, optional media etc.)
    const { isValid, errors } = validateTweet(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // Find tweet by tweet_id
    Tweet.findById(tweet_id).then(tweet => {
      if (!tweet) {
        return res.status(404).json({ message: 'Tweet not found' });
      }
      // Tweet exists
      // Create new tweet
      const tweetContent = {
        text: req.body.text
      };
      // Add optional media property if exists
      if (req.body.media) {
        tweetContent.media = req.body.media;
      }
      const newTweet = new Tweet(tweetContent);
      // Add user property to indicate the owner of the tweet
      newTweet.user = req.user._id;
      newTweet
        .save()
        .then(savedTweet => {
          if (savedTweet) {
            // Add created tweet id to Tweet which is commented comments
            tweet.comments.push(savedTweet._id);
            tweet
              .save()
              .then(t => res.json(t))
              .catch(err => next(err));
          } else {
            return res.status(500).json({ message: 'Tweet not saved' });
          }
        })
        .catch(err => next(err));
    });
  }
);

module.exports = router;
