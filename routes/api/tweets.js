const express = require('express');
const router = express.Router();
const passport = require('passport');
const Tweet = require('../../models/Tweet');

const validateObjectId = require('../../validation/objectId');
const validateTweet = require('../../validation/createTweet');

// @route   GET api/tweets/:tweet_id
// @desc    Get tweet by tweet ID
// @access  Public
router.get('/:tweet_id', (req, res, next) => {
  const { tweet_id } = req.params;
  const errors = {};

  const { idErrors, isValidObjectId } = validateObjectId(tweet_id);
  if (!isValidObjectId) {
    return res.status(400).json(idErrors);
  }

  Tweet.findOne({ _id: tweet_id })
    .then(tweet => {
      if (!tweet) {
        errors.notweet = 'Tweet does not exists';
        return res.status(404).json(errors);
      }

      res.json(tweet);
    })
    .catch(err => next(err));
});

// @route   GET api/tweets/all/:user_id
// @desc    Get all tweets posted by the same user
// @access  Public
router.get('/all/:user_id', (req, res, next) => {
  const { user_id } = req.params;
  const errors = {};

  const { idErrors, isValidObjectId } = validateObjectId(user_id);
  if (!isValidObjectId) {
    return res.status(400).json(idErrors);
  }

  Tweet.find({ user: user_id })
    .then(tweets => {
      if (!tweets) {
        errors.notweets = 'That user does not have any tweets';
        return res.status(404).json(errors);
      }

      res.json(tweets);
    })
    .catch(err => next(err));
});

// @route   POST api/tweets
// @desc    Create or update tweet
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { errors, isValid } = validateTweet(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // 1. Create new tweet
    const newTweet = new Tweet(req.body);
    newTweet.user = req.user._id;

    newTweet.save().then(savedTweet => {
      if (!savedTweet) {
        errors.tweet = 'Cannot save new tweet';
        return res.status(500).json(errors);
      }

      res.json(savedTweet);
    });
  }
);

// @route   PUT api/tweets/:tweet_id
// @desc    Update tweet (only by tweet author)
// @access  Private
router.put(
  '/:tweet_id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    // 1. Validate tweet_id
    // 2. Check if tweet does exists
    // 3. If yes, make sure user is the author
    // 4. If tweet does not exists, return with appropriate message and status code
    // 5. If user is not author of this tweet, also send appropriate content
    const { tweet_id } = req.params;
    let { idErrors, isValidObjectId } = validateObjectId(tweet_id);
    if (!isValidObjectId) {
      return res.status(400).json(idErrors);
    }

    const { errors, isValid } = validateTweet(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Tweet.findOne({ _id: tweet_id }).then(tweet => {
      if (!tweet) {
        errors.tweet = 'This tweet does not exists';
        return res.status(404).json(errors);
      }
      // Make sure user is the owner of this tweet, if it is, then validate and update it
      if (req.user._id.equals(tweet.user)) {
        errors.notowner = 'You can change only your tweets';
        return res.status(401).json(errors);
      }

      tweet.text = req.body.text;
      if (req.body['media']) {
        tweet.media = req.body.media;
      }

      tweet
        .save()
        .then(savedTweet => {
          if (!savedTweet) {
            errors.tweetnotsaved = 'There was a problem with saving your tweet';
            return res.status(500).json(errors);
          }

          res.json(savedTweet);
        })
        .catch(err => next(err));
    });
  }
);

module.exports = router;
