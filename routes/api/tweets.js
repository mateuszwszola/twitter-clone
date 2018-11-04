const express = require('express');
const router = express.Router();
const passport = require('passport');
const Tweet = require('../../models/Tweet');

const validateObjectId = require('../../validation/objectId');

// @route   GET api/tweets/:tweet_id
// @desc    Get tweet by tweet ID
// @access  Public
router.get('/:tweet_id', (req, res, next) => {
  const { tweet_id } = req.params;
  const errors = {};

  const { idErrors, isValid } = validateObjectId(tweet_id);
  if (!isValid) {
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

  const { idErrors, isValid } = validateObjectId(user_id);
  if (!isValid) {
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
// @desc    Create tweet
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {}
);

module.exports = router;
