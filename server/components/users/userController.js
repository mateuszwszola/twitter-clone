const { User } = require('./');

exports.getUser = async (req, res) => {
  return res.json({ user: req.user });
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id).select('-password');
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User Not Found' }] });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ errors: [{ msg: 'User Not Found' }] });
    }
    next(err);
  }
};
