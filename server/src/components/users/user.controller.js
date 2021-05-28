const { pick } = require('lodash');
const { ErrorHandler } = require('../../utils/error');
const { User } = require('./');
const Profile = require('../profiles/profile.model');
const Tweet = require('../tweets/tweet.model');

exports.getUsers = async (req, res) => {
  const filters = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const users = await User.paginate(filters, options);

  res.json(users);
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  res.json({ user });
};

exports.createUser = async (req, res) => {
  const userBody = pick(req.body, ['name', 'username', 'email', 'password', 'role', 'avatar']);

  if (await User.isEmailTaken(userBody.email)) {
    throw new ErrorHandler(400, 'Email already taken');
  }

  if (await User.isUsernameTaken(userBody.username)) {
    throw new ErrorHandler(400, 'Username already taken');
  }

  const user = new User(userBody);
  // Create user profile
  const profile = new Profile({ user: user.id });

  await Promise.all([user.save(), profile.save()]);

  res.status(201).json({ user });
};

exports.updateUser = async (req, res) => {
  const newValues = pick(req.body, ['name', 'username', 'email', 'password', 'role', 'avatar']);
  const { userId } = req.params;

  if (newValues.email && (await User.isEmailTaken(newValues.email, userId))) {
    throw new ErrorHandler(400, 'Email already taken');
  }

  if (newValues.username && (await User.isUsernameTaken(newValues.username, userId))) {
    throw new ErrorHandler(400, 'Username already taken');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  Object.assign(user, newValues);

  await user.save();

  res.json({ user });
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  await Promise.all([
    user.remove(),
    Profile.findOneAndRemove({ user: user._id }),
    Tweet.deleteMany({ author: user._id }),
  ]);

  res.json({ user });
};
