const { pick } = require('lodash');
const Profile = require('./profile.model');
const { ErrorHandler } = require('../../utils/error');

exports.getProfile = async (req, res) => {
  const { userId } = req.params;

  const profile = await Profile.findOne({
    user: userId,
  }).populate('user', ['name', 'username']);

  if (!profile) {
    throw new ErrorHandler(404, 'Profile not found');
  }

  res.json({ profile });
};

exports.getProfiles = async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filters = pick(req.query, ['following', 'followers']);

  options.populate = {
    path: 'user',
    select: ['name', 'username'],
  };

  const profiles = await Profile.paginate(filters, options);

  res.json(profiles);
};

exports.updateProfile = async (req, res) => {
  const { userId } = req.params;

  const fields = [
    'bio',
    'location',
    'website',
    'birthday',
    'avatar',
    'backgroundImage',
  ];

  const newValues = pick(req.body, fields);

  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new ErrorHandler(404, 'Profile not found');
  }

  Object.assign(profile, newValues);

  await profile.save();

  res.json({ profile });
};

exports.followProfile = async (req, res) => {
  const { userId } = req.params;
  const { _id: authUserId } = req.user;

  if (userId === authUserId.toString()) {
    throw new ErrorHandler(400, 'You cannot follow your own profile');
  }

  const [authUserProfile, profileToFollow] = await Promise.all([
    Profile.findOne({ user: authUserId }),
    Profile.findOne({ user: userId }),
  ]);

  if (!profileToFollow) {
    throw new ErrorHandler(404, 'Profile does not exists');
  }

  if (authUserProfile.isFollowing(userId)) {
    throw new ErrorHandler(400, 'You already follow that profile');
  }

  profileToFollow.followers.push(authUserId);

  await Promise.all([authUserProfile.follow(userId), profileToFollow.save()]);

  return res.json({ profile: authUserProfile });
};

exports.unfollowProfile = async (req, res) => {
  const { userId } = req.params;
  const { _id: authUserId } = req.user;

  if (userId === authUserId.toString()) {
    throw new ErrorHandler(400, 'You cannot unfollow your own profile');
  }

  const [authUserProfile, profileToFollow] = await Promise.all([
    Profile.findOne({ user: authUserId }),
    Profile.findOne({ user: userId }),
  ]);

  if (!profileToFollow) {
    throw new ErrorHandler(404, 'Profile does not exists');
  }

  if (!authUserProfile.isFollowing(userId)) {
    throw new ErrorHandler(400, 'You do not follow that profile');
  }

  profileToFollow.followers.remove(authUserId);

  await Promise.all([authUserProfile.unfollow(userId), profileToFollow.save()]);

  return res.json({ profile: authUserProfile });
};
