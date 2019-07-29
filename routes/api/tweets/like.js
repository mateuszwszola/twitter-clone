const router = require('express').Router();
const auth = require('../../../middleware/auth');

const Profile = require('../../../models/Profile');
const Tweet = require('../../../models/Tweet');

// @route   GET api/tweets/like/:user_id
// @desc    Get list of profile's likes (tweets)
// @access  Public
router.get('/:user_id', async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const profile = await Profile.findOne({ user: user_id });
    const tweets = await Tweet.find({
      user: { $in: profile.likes }
    }).populate('user', ['name', 'username', 'avatar']);

    res.json(tweets);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tweet does not exists' });
    }
    next(err);
  }
});

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
    const index = tweet.likes.findIndex(like => like.equals(profile.user));
    if (index > -1) {
      // User already like this tweet, unlike
      tweet.likes = tweet.likes.filter(like => !like.equals(profile.user));
      profile.likes = profile.likes.filter(like => !like.equals(tweet_id));
    } else {
      // Like
      tweet.likes = [profile.user, ...tweet.likes];
      profile.likes = [tweet_id, ...profile.likes];
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
