const validator = require('validator');
const { User } = require('../users');
const { Profile } = require('../profiles');

exports.registerUser = async (req, res) => {
  const { name, email, password, username } = req.body;

  const user = await User.create({
    name,
    username,
    email,
    password,
  });

  const [token] = await Promise.all([
    user.generateAuthToken(),
    // Create user profile
    Profile.create({ user: user._id }),
  ]);

  return res.status(201).json({ user, token });
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  const isEmail = validator.isEmail(username);

  const user = await User.findByCredentials(username, password, isEmail);
  const token = await user.generateAuthToken();

  return res.status(200).json({ user, token });
};
