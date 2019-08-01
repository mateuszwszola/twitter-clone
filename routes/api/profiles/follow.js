const router = require('express').Router();
const auth = require('../../../middleware/auth');

const Profile = require('../../../models/Profile');

// @route   GET api/profiles/follow/:user_id/followers
// @desc    Get profile list of followers profiles
// @access  Public
router.get('/follow/:user_id/followers', async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const { followers } = await Profile.findOne({ user: user_id });
    const profiles = await Profile.find({
      user: { $in: followers }
    }).populate('user', ['name', 'username', 'avatar']);

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Profile does not exists' });
    }
    next(err);
  }
});

// @route   GET api/profiles/follow/:user_id/following
// @desc    Get profile list of following profiles
// @access  Public
router.get('/follow/:user_id/following', async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const profile = await Profile.findOne({ user: user_id });
    const profiles = await Profile.find({
      user: { $in: profile.following }
    }).populate('user', ['name', 'username', 'avatar']);

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Profile does not exists' });
    }
    next(err);
  }
});

// @route   POST api/profiles/follow/:user_id
// @desc    Follow a user
// @access  Private
router.post('/follow/:user_id', auth, async (req, res, next) => {
  const { user_id } = req.params;

  if (req.user.id === user_id) {
    return res.status(400).json({
      message: 'You cannot follow your own profile'
    });
  }

  try {
    const userProfile = await Profile.findOne({ user: req.user.id });
    const profileToFollow = await Profile.findOne({ user: user_id });

    if (!profileToFollow) {
      return res.status(400).json({ message: 'Profile does not exists' });
    }

    const index = userProfile.following.findIndex(
      user => user.toString() === user_id
    );

    if (index > -1) {
      return res.status(400).json({
        message: 'You have already followed that profile'
      });
    } else {
      userProfile.following = [user_id, ...userProfile.following];
      profileToFollow.followers = [req.user.id, ...profileToFollow.followers];
    }

    await userProfile.save();
    await profileToFollow.save();

    res.json(userProfile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Profile to follow does not exists' });
    }
    next(err);
  }
});

// @route   POST api/profiles/unfollow/:user_id
// @desc    Unfollow a user
// @access  Private
router.post('/unfollow/:user_id', auth, async (req, res, next) => {
  const { user_id } = req.params; // profile to follow user ID

  if (req.user.id === user_id) {
    return res.status(400).json({
      message: 'You cannot unfollow your own profile'
    });
  }

  try {
    const userProfile = await Profile.findOne({ user: req.user.id });
    const profileToFollow = await Profile.findOne({ user: user_id });

    if (!profileToFollow) {
      return res
        .status(400)
        .json({ message: 'Following profile does not exists' });
    }

    const index = userProfile.following.findIndex(
      user => user.toString() === user_id
    );
    if (index > -1) {
      userProfile.following = userProfile.following.filter(
        follow => follow.toString() !== user_id
      );
      profileToFollow.followers = profileToFollow.followers.filter(
        follower => follower.toString() !== req.user.id
      );
    } else {
      return res.status(400).json({
        message: 'You cannot unfollow that profile'
      });
    }

    await userProfile.save();
    await profileToFollow.save();
    res.json(userProfile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Profile to follow does not exists' });
    }
    next(err);
  }
});

module.exports = router;
