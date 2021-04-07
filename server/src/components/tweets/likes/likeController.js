const { Profile } = require('../../profiles');
const { Tweet } = require('../tweet');

exports.getProfileLikes = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const profile = await Profile.findOne({ user: user_id });
    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Profile does not exists' }] });
    }

    const tweets = await Tweet.find({
      _id: { $in: profile.likes },
    }).populate('user', ['name', 'username', 'avatar']);

    res.json(tweets);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Profile does not exists' }] });
    }
    next(err);
  }
};

exports.toggleTweetLike = async (req, res, next) => {
  const { tweet_id } = req.params;

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const tweet = await Tweet.findById(tweet_id).populate('user', [
      'name',
      'username',
      'avatar',
    ]);

    if (!tweet) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Tweet does not exists' }] });
    }
    const index = tweet.likes.findIndex((like) => like.equals(profile.user));
    if (index > -1) {
      // User already like this tweet, unlike
      tweet.likes = tweet.likes.filter((like) => !like.equals(profile.user));
      profile.likes = profile.likes.filter((like) => !like.equals(tweet_id));
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
      return res
        .status(404)
        .json({ errors: [{ msg: 'Tweet does not exists' }] });
    }
    next(err);
  }
};
