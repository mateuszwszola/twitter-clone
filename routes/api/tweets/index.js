const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');

const Tweet = require('../../../models/Tweet');
const Profile = require('../../../models/Profile');

const likeRouter = require('./like');
const commentRouter = require('./comment');

const validateTweet = require('../../../validation/createTweet');

router.use('/like', likeRouter);
router.use('/comment', commentRouter);

// @route   GET api/tweets/all
// @desc    Get all tweets
// @access  Public
router.get('/all', async (req, res, next) => {
  try {
    const tweets = await Tweet.find({})
      .sort({ created: -1 })
      .populate('User', ['name', 'username', 'avatar']);
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
      return res.status(404).json({ msg: 'User that not exists' });
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
    // profile -> profil uzytkownika, ktory dodaje danego tweet
    profile.tweets = [{ _id: tweet.id }, ...profile.tweets];
    profile.homepageTweets = [{ _id: tweet.id }, ...profile.homepageTweets];
    await profile.save();

    // loop through profiles and for each add a tweet_id
    profile.followers.forEach(async follower => {
      const followerProfile = await Profile.findOne({ user: follower.user });
      followerProfile.homepageTweets = [
        { _id: tweet.id },
        ...followerProfile.homepageTweets
      ];
      await followerProfile.save();
    });

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
  // 1. Validate tweet_id
  // 2. Check if tweet does exists
  // 3. If yes, make sure user is the author
  // 4. If tweet does not exists, return with appropriate message and status code
  // 5. If user is not author of this tweet, also send appropriate content
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
    // Make sure tweet does exists
    const tweet = await Tweet.findById(tweet_id);
    // Tweet does not exists
    if (!tweet) {
      return res.status(404).json({ msg: 'Tweet does not exists' });
    }
    // Tweet does exists
    // Make sure the user is the owner of that tweet
    if (req.user.id !== tweet.user.toString()) {
      return res
        .status(401)
        .json({ msg: 'You are not allowed to delete that tweet' });
    }

    // Delete tweet
    await tweet.remove();
    // remove it from profile.tweets
    const profile = await Profile.findOne({ user: req.user.id });

    console.log('tweet.id', tweet.id);
    profile.tweets = profile.tweets.filter(
      tweet => tweet._id.toString() !== tweet_id
    );
    profile.homepageTweets = profile.homepageTweets.filter(
      tweet => tweet._id.toString() !== tweet_id
    );

    await profile.save();

    // remove tweet_id from all followers profile.homepageTweets
    profile.followers.forEach(async follower => {
      const followerProfile = await Profile.findOne({ user: follower.user });
      followerProfile.homepageTweets = followerProfile.homepageTweets.filter(
        followerTweet => followerTweet._id.toString() !== tweet_id
      );
      await followerProfile.save();
    });

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
