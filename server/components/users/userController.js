const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const validator = require('validator');
const startCase = require('../../helpers/startCase');
const charLengthForProps = require('../../helpers/charLengthForProps');
const { JWT_SECRET } = require('../../config/keys');
const { User } = require('./');
const { Profile } = require('../profiles');

const SALT_ROUNDS = 10;

exports.validate = (method) => {
  switch (method) {
    case 'registerUser': {
      return [
        body('name', 'name is required')
          .exists()
          .trim()
          .not()
          .isEmpty()
          .isLength(charLengthForProps.name)
          .withMessage(
            `The name must be between ${charLengthForProps.name.min} and ${charLengthForProps.name.max} chars`
          )
          .customSanitizer(startCase),
        body('username', 'username is required')
          .exists()
          .trim()
          .not()
          .isEmpty()
          .custom((value) => {
            const username = value.toString().split(' ').join('');
            return User.findOne({ username }).then((user) => {
              if (user) {
                return Promise.reject('username already in use');
              }
            });
          })
          .isLength(charLengthForProps.username)
          .withMessage(
            `The username must be between ${charLengthForProps.username.min} and ${charLengthForProps.username.max} chars`
          )
          .customSanitizer((value) => {
            return value.split(' ').join('');
          }),
        body('email', 'email is required')
          .exists()
          .trim()
          .not()
          .isEmpty()
          .isEmail()
          .withMessage('invalid email')
          .custom((value) => {
            return User.findOne({ email: value }).then((user) => {
              if (user) {
                return Promise.reject('e-mail already in use');
              }
            });
          })
          .normalizeEmail(),
        body('password', 'password is required')
          .exists()
          .trim()
          .not()
          .isEmpty()
          .isLength(charLengthForProps.password)
          .withMessage(
            `The password must be between ${charLengthForProps.password.min} and ${charLengthForProps.password.max} chars`
          ),
        body('password2', 'confirmation password is required')
          .exists()
          .trim()
          .not()
          .isEmpty()
          .custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('password confirmation does not match password');
            }

            return true;
          }),
        body('avatar')
          .optional({ checkFalsy: true })
          .isURL()
          .withMessage('avatar must be a valid URL'),
      ];
    }
    case 'loginUser': {
      return [
        body('username', 'username is required')
          .exists()
          .trim()
          .not()
          .isEmpty(),
        body('password', 'password is required')
          .exists()
          .trim()
          .not()
          .isEmpty(),
      ];
    }
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
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

exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }

  const { name, email, password, username } = req.body;

  try {
    const user = new User({
      name,
      username,
      email,
      password,
    });

    // Create empty profile for that user
    const profile = new Profile({});

    // Hash the password
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    profile.user = user._id;
    await profile.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };
    // Sign token
    jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) return next(err);
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }

  const { username, password } = req.body;

  let login = 'username';
  if (validator.isEmail(username)) {
    login = 'email';
  }

  try {
    const user = await User.findOne({ [login]: username });
    if (!user) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Incorrect username and password combination',
            param: 'login',
          },
        ],
      });
    }

    // Check passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Incorrect username and password combination',
            param: 'login',
          },
        ],
      });
    }

    // User matched
    // Create JWT Payload
    const payload = {
      user: {
        id: user.id,
      },
    };
    // Sign token
    jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) return next(err);
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};
