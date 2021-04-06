const { validationResult } = require('express-validator');
const validator = require('validator');
const { User } = require('../users');

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, email, password, username } = req.body;

  const user = await User.create({
    name,
    username,
    email,
    password,
  });

  const token = user.generateAuthToken();

  return res.status(201).json({ user, token });
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }

  const { username, password } = req.body;

  const isEmail = validator.isEmail(username);

  const user = await User.findByCredentials(username, password, isEmail);
  const token = user.generateAuthToken();

  return res.status(200).json({ user, token });
};
