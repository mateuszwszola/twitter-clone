const { matchedData } = require('express-validator');
const { ErrorHandler } = require('../../utils/error');
const { User } = require('./');
const { Profile } = require('../profiles');
const { pick } = require('lodash');

exports.getUsers = async (req, res) => {
  const { skip, limit } = req.query;

  const users = await User.find({}).skip(skip).limit(limit);

  res.json({ users });
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  const { role, id: authUserId } = req.user;

  if (role !== 'admin' || authUserId.toString() !== userId) {
    throw new ErrorHandler(
      403,
      'You are not authorized to access this resource'
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  res.json({ user });
};

exports.createUser = async (req, res) => {
  const userBody = pick(req.body, [
    'name',
    'username',
    'email',
    'password',
    'role',
  ]);

  const user = await User.create(userBody);

  res.status(201).json({ user });
};

exports.updateUser = async (req, res) => {
  const newValues = matchedData(req.body, { includeOptionals: false });
  const { id: authUserId } = req.user;
  const { userId } = req.params;

  if (authUserId.toString() !== userId) {
    throw new ErrorHandler(
      403,
      'You are not authorized to access this resource'
    );
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

  await Promise.all([user.remove(), Profile.findByIdAndRemove(user.id)]);

  res.json({ user });
};
