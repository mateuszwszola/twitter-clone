const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
// Load models
const Profile = require('../../../models/Profile');
const Tweet = require('../../../models/Tweet');
const User = require('../../../models/User');

// Load additional routers
const followRouter = require('./follow');

// Load validation functions
const validateProfileInput = require('../../../validation/profile');
// Load helper functions
const startCase = require('../../../helpers/startCase');

router.use('/follow', followRouter);

// @route   GET api/profiles/
// @desc    Get logged in user profile
// @access  Private
router.get('/', auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'username', 'avatar']
    );
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// @route   GET api/profiles/homepageTweets
// @desc    Get logged in user profile with tweets to display on the homepage
// @access  Private
router.get('/homepageTweets', auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'username', 'avatar'])
      .populate('homepageTweets.tweet');

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// @route   GET api/profiles/tweets
// @desc    Get logged in user profile with tweets
// @access  Private
router.get('/tweets', auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'username', 'avatar'])
      .populate('tweets.tweet');

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// @route   GET api/profiles/all
// @desc    Get all profiles
// @access  Public
router.get('/all', async (req, res, next) => {
  try {
    const profiles = await Profile.find({})
      .sort({ created: -1 })
      .populate('user', ['name', 'username', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// @route   GET api/profiles/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/:user_id', async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const profile = await Profile.findOne({ user: user_id }).populate('user', [
      'name',
      'username',
      'avatar'
    ]);

    if (!profile) {
      errors.noprofile = 'Profile not found';
      return res.status(404).json(errors);
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    next(err);
  }
});

// @route   GET api/profiles/username/:username
// @desc    Get profile by username
// @access  Public
router.get('/username/:username', async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    const profile = await Profile.findOne({ user: user.id }).populate('user', [
      'name',
      'username',
      'avatar'
    ]);
    if (!profile) {
      return res
        .status(404)
        .json({ msg: `Profile for ${username} does not exists` });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// @route   POST api/profiles
// @desc    Update user PROFILE
// @access  Private
router.post('/', auth, async (req, res, next) => {
  const { errors, isValid } = validateProfileInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Validation before checks if name exists, if value is empty and if it is alphanumeric, so here I only check if property name in req.body is "something" in order to change it
  try {
    if (req.body['name']) {
      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: { name: startCase(req.body['name']) } },
        { new: true }
      );

      if (!user) {
        errors.name = 'There was a problem with updating the user name';
        return res.status(500).json(errors);
      }
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    const standardFields = [
      'bio',
      'location',
      'website',
      'birthday',
      'backgroundPicture',
      'created'
    ];

    standardFields.forEach(field => {
      if (req.body.hasOwnProperty(field)) {
        profileFields[field] = req.body[field];
      }
    });

    // Update the profile
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true }
    );

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// @route   DELETE api/profiles
// @desc    Delete user account (profile and user)
// @access  Private
router.delete('/', auth, async (req, res, next) => {
  try {
    await User.findByIdAndRemove(req.user.id);
    await Profile.findOneAndRemove({ user: req.user.id });
    res.json({ message: 'Success' });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// @route   GET api/profiles/homepageTweets/all
// @desc    Get all tweets from profile.homepageTweets to display them in the profile homepage
// @access  Private
router.get('/homepageTweets/all', auth, async (req, res, next) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'Profile does not exists';
      return res.status(404).json(errors);
    }
    const homepageTweets = profile.homepageTweets.map(
      homepageTweet => homepageTweet.tweet
    );
    const tweets = await Tweet.find({ id: { $in: homepageTweets } })
      .populate('user', ['name', 'username', 'avatar'])
      .sort({ created: -1 });

    res.json(tweets);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

module.exports = router;
