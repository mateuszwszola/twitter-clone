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

  options.populate = {
    path: 'user',
    select: ['name', 'username'],
  };

  const profiles = await Profile.paginate({}, options);

  res.json({ profiles });
};

exports.updateProfile = async (req, res) => {
  const { userId } = req.user;

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
