const express = require('express');
const router = express.Router();
const passport = require('passport');

const Profile = require('../../../models/Profile');
const Tweet = requier('../../../models/Tweet');
const validateObjectId = require('../../../validation/objectId');

// @route   POST api/profiles/like/:tweet_id
// @desc    Like tweet
// @access  Private
router.post(
  '/like/:tweet_id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    /*
      1. Check if tweet_id is valid objectId
      2. Find and make sure tweet does exists
          The user can like his posts
      3. Determine if like or unlike
      4. Add/remove like from Profile and Tweet
    */
    const { tweet_id } = req.params;
    const { idErrors, isValidObjectId } = validateObjectId(tweet_id);
    const errors = {};

    if (!isValidObjectId) {
      return res.status(400).json(idErrors);
    }

    Profile.findOne({ user: req.user._id }).then(profile => {
      Tweet.findById(tweet_id).then(tweet => {
        if (!tweet) {
          errors.tweetnotfound = 'Tweet does not exists';
          return res.status(404).json(errors);
        }
        // Tweet exists
      });
    });
  }
);
