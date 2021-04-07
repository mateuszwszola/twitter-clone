const { validationResult } = require('express-validator');
const _ = require('lodash');
const { Profile } = require('./profile');
const { User } = require('../users');
const { ErrorHandler } = require('../../utils/error');

exports.getUserProfile = async (req, res) => {
  const { id: userId } = req.user;

  const profile = await Profile.findOne({
    user: userId,
  }).populate('user', ['name', 'username']);

  if (!profile) {
    throw new ErrorHandler(404, 'Profile not found');
  }

  res.json({ profile });
};

exports.getProfiles = async (req, res) => {
  const { userId, username, skip = 0, limit = 100 } = req.query;

  let query;

  if (userId) {
    query = Profile.findOne({ user: userId });
  } else if (username) {
    query = Profile.findOne({ username });
  } else {
    query = Profile.find({})
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ _id: 'asc' });
  }

  const profiles = await query.populate('user', ['name', 'username', 'avatar']);

  if (!profiles) {
    throw new ErrorHandler(404, 'No docs found');
  }

  res.json({ profiles });
};

exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const fields = [
    'bio',
    'location',
    'website',
    'birthday',
    'avatar',
    'backgroundPicture',
  ];

  const newValues = _.pick(req.body, fields);

  const { id: userId } = req.user;

  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    { $set: newValues },
    { new: true }
  ).populate('user', ['name', 'username']);

  res.json({ profile });
};

exports.deleteAccount = async (req, res) => {
  const { id: userId } = req.user;

  const profile = await Profile.findOne({ user: userId });

  await Promise.all([
    Profile.findOneAndRemove({ user: userId }),
    User.findByIdAndRemove(req.user.id),
    Profile.updateMany(
      { user: { $in: profile.followers } },
      { $pull: { following: req.user.id } }
    ),
  ]);

  res.json({ message: 'Success' });
};
