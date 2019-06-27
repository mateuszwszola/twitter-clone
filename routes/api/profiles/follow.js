const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');

const Profile = require('../../../models/Profile');

// @route   POST api/profiles/follow/:user_id
// @desc    Add or remove following
// @access  Private
router.post('/:user_id', auth, async (req, res, next) => {
  const { user_id } = req.params; // profile to follow user ID

  if (req.user.id === user_id.toString()) {
    return res.status(400).json({
      message: 'You cannot follow your own profile'
    });
  }

  try {
    const userProfile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'username', 'avatar']
    );
    const profileToFollow = await Profile.findOne({ user: user_id });
    if (!profileToFollow) {
      return res
        .status(400)
        .json({ message: 'Profile to follow does not exists' });
    }

    // Determine to follow or unfollow
    const index = userProfile.following.findIndex(
      follow => follow.user.toString() === user_id
    );
    if (index > -1) {
      // Index was found => unfollow
      userProfile.following = userProfile.following.filter(
        follow => !follow.user.toString() === user_id
      );
      profileToFollow.followers = profileToFollow.followers.filter(
        follower => !follower.user.toString() === userProfile.user
      );
    } else {
      // Index was not found => follow that profile
      // Add profile to your following profiles
      userProfile.following = [{ user: user_id }, ...userProfile.following];
      // Add your profile to profile to follow followers array
      profileToFollow.followers = [
        { user: userProfile.user },
        ...profileToFollow.followers
      ];
    }

    // Save your profile
    await userProfile.save();
    // Save someone's profile
    await profileToFollow.save();
    res.json(userProfile);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Profile to follow does not exists' });
    }
    console.error(err.message);
    next(err);
  }
});

module.exports = router;
