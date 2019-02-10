const express = require('express');
const router = express.Router();
const passport = require('passport');

const Profile = require('../../../models/Profile');
const Tweet = require('../../../models/Tweet');
const validateObjectId = require('../../../validation/objectId');

// @route   POST api/tweets/like/:tweet_id
// @desc    Like or unlike tweet
// @access  Private
router.post(
  '/:tweet_id',
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
        // Determine if like or unlike tweet
        const index = tweet.likes.findIndex(like =>
          like.user.equals(profile.user)
        );
        if (index > -1) {
          // User already like this tweet, unlike
          tweet.likes = tweet.likes.filter(
            like => !like.user.equals(profile.user)
          );
          tweet
            .save()
            .then(updatedTweet => res.json(updatedTweet))
            .catch(err => next(err));
        } else {
          // Like
          tweet.likes = [{ user: profile.user }, ...tweet.likes];
          tweet
            .save()
            .then(updatedTweet => res.json(updatedTweet))
            .catch(err => next(err));
        }
      });
    });
  }
);

module.exports = router;
