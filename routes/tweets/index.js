const router = require('express').Router();
const auth = require('../../middleware/auth');

const Tweet = require('../../models/Tweet');
const Profile = require('../../models/Profile');

const validateTweet = require('../../validation/createTweet');

router.use('/like', require('./like'));
router.use('/comment', require('./comment'));

// @route   GET api/tweets/all
// @desc    Get all tweets
// @access  Public
router.get('/all', async (req, res, next) => {
  try {
    const tweets = await Tweet.find({})
      .sort({ created: -1 })
      .populate('user', ['name', 'username', 'avatar']);
    res.json(tweets);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// @route   GET api/tweets/all/:user_id
// @desc    Get all tweets posted by the user
// @access  Public
router.get('/all/:user_id', async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const tweets = await Tweet.find({ user: user_id })
      .sort({ created: -1 })
      .populate('user', ['name', 'username', 'avatar']);

    res.json(tweets);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User does not exists' });
    }
    next(err);
  }
});

// @route   GET api/tweets/homepageTweets
// @desc    Get all profile's homepageTweets
// @access  Public
router.get('/homepageTweets', auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const tweets = await Tweet.find({
      _id: { $in: profile.homepageTweets }
    })
      .sort({ created: -1 })
      .populate('user', ['name', 'username', 'avatar']);
    res.json(tweets);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// @route   GET api/tweets/:tweet_id
// @desc    Get tweet by tweet ID
// @access  Public
router.get('/:tweet_id', async (req, res, next) => {
  const { tweet_id } = req.params;

  try {
    const tweet = await Tweet.findById(tweet_id).populate('user', [
      'name',
      'username',
      'avatar'
    ]);
    if (!tweet) {
      return res.status(404).json({ msg: 'Tweet does not exists' });
    }
    res.json(tweet);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tweet does not exists' });
    }
    next(err);
  }
});

// @route   POST api/tweets
// @desc    Create tweet
// @access  Private
router.post('/', auth, async (req, res, next) => {
  const { errors, isValid } = validateTweet(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const tweetContent = { text: req.body.text };

  if (req.body.media) {
    tweetContent.media = req.body.media;
  }

  try {
    const newTweet = new Tweet(tweetContent);
    newTweet.user = req.user.id;
    const savedTweet = await newTweet.save();
    const tweet = await Tweet.populate(savedTweet, {
      path: 'user',
      select: ['name', 'username', 'avatar']
    });

    // User created a tweet, add a reference (tweet_id) to user profile.tweets array, and to every follower profile.homepageTweets array
    const profile = await Profile.findOne({ user: req.user.id });

    await Profile.updateOne(
      { user: req.user.id },
      { $push: { tweets: tweet.id, homepageTweets: tweet.id } }
    );

    // loop through profile followers and for each add a tweet_id to their homepageTweets
    await Profile.updateMany(
      { user: { $in: profile.followers } },
      { $push: { homepageTweets: tweet.id } }
    );

    res.json(tweet);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// @route   PUT api/tweets/:tweet_id
// @desc    Update tweet (only by tweet author)
// @access  Private
router.put('/:tweet_id', auth, async (req, res, next) => {
  const { tweet_id } = req.params;

  const { errors, isValid } = validateTweet(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const tweet = await Tweet.findById(tweet_id);
    if (!tweet) {
      return res.status(404).json({ msg: 'Tweet does not exists' });
    }

    // Make sure user is the owner of this tweet, if it is, then validate and update it
    if (req.user.id !== tweet.user.toString()) {
      return res
        .status(401)
        .json({ msg: 'You cannot update someone else tweets' });
    }

    const newTweet = {
      text: req.body.text,
      editted: true
    };

    if (req.body['media']) {
      newTweet.media = req.body.media;
    }

    const savedTweet = await Tweet.findByIdAndUpdate(
      tweet_id,
      { $set: newTweet },
      { new: true }
    );
    res.json(savedTweet);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tweet does not exists' });
    }
    next(err);
  }
});

// @route   DELETE api/tweets/:tweet_id
// @desc    Delete tweet
// @access  Private
router.delete('/:tweet_id', auth, async (req, res, next) => {
  const { tweet_id } = req.params;

  try {
    const tweet = await Tweet.findById(tweet_id);

    if (!tweet) {
      return res.status(404).json({ msg: 'Tweet does not exists' });
    }

    if (req.user.id !== tweet.user.toString()) {
      return res
        .status(401)
        .json({ msg: 'You are not allowed to delete that tweet' });
    }

    // Delete tweet
    await tweet.remove();
    await Profile.updateOne(
      { user: req.user.id },
      { $pull: { tweets: tweet_id, homepageTweets: tweet_id, likes: tweet_id } }
    );

    const profile = await Profile.findOne({ user: req.user.id });
    await Profile.updateMany(
      { user: { $in: profile.followers } },
      { $pull: { homepageTweets: tweet_id } }
    );

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
