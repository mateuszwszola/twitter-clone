const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');

const Profile = require('../../../models/Profile');
const Tweet = require('../../../models/Tweet');

// @route   POST api/tweets/like/:tweet_id
// @desc    Like or unlike tweet
// @access  Private
router.post('/:tweet_id', auth, async (req, res, next) => {
  const { tweet_id } = req.params;
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const tweet = await Tweet.findById(tweet_id).populate('user', [
      'name',
      'username',
      'avatar'
    ]);
    if (!tweet) {
      return res.status(404).json({ msg: 'Tweet does not exists' });
    }
    const index = tweet.likes.findIndex(like => like.user.equals(profile.user));
    if (index > -1) {
      // User already like this tweet, unlike
      tweet.likes = tweet.likes.filter(like => !like.user.equals(profile.user));
      profile.likes = profile.likes.filter(
        like => !like.tweet.equals(tweet_id)
      );
    } else {
      // Like
      tweet.likes = [{ user: profile.user }, ...tweet.likes];
      profile.likes = [{ tweet: tweet_id }, ...profile.likes];
    }

    await tweet.save();
    await profile.save();
    res.json(tweet);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tweet does not exists' });
    }
    next(err);
  }
});

module.exports = router;
