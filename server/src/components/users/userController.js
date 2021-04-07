const { User } = require('./');
const { ErrorHandler } = require('../../utils/error');

exports.getUser = async (req, res) => {
  const { id: userId } = req.user;

  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new ErrorHandler(403, 'You are not authorized');
  }

  return res.json({ user });
};

exports.getAllUsers = async (_req, res) => {
  const users = await User.find({}).select('-password');
  res.json({ users });
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  res.json({ user });
};
