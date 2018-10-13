const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../../config/keys').secretOrKey;
const passport = require('passport');
const validator = require('validator');

// Load validation functions
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require('../../models/User');

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post('/register', (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { name, email, password } = req.body;
  let { username } = req.body;

  if (username.split(' ').length > 1) {
    username = username.split(' ').join('');
  }
  // Check if user with that email/username already exists in db
  User.findOne({ email })
    .then(userByEmail => {
      if (userByEmail) {
        errors.email = 'User with that email has already been created';
        return res.status(400).json(errors);
      }

      User.findOne({ username })
        .then(userByUsername => {
          if (userByUsername) {
            errors.username =
              'User with that username has already been created';
            return res.status(400).json(errors);
          }

          // There is no user with that email/username in db, create the user
          const newUser = new User({
            name,
            username,
            email,
            password
          });

          // Hash the password
          bcrypt.genSalt(10, (err, salt) => {
            if (err) next(err);
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) next(err);
              newUser.password = hash;
              newUser
                .save()
                .then(user => res.json(user))
                .catch(err => {
                  next(err);
                });
            });
          });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// @route   POST api/users/login
// @desc    Login user / Returning JWT
// @access  Public
router.post('/login', (req, res, next) => {
  const { isValid, errors } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { username, password } = req.body;
  /*
    1. Server will receive username and password
    2. Username can be user username or email
    3. Check if username is user username or email
  */
  let login = 'username';
  if (validator.isEmail(username)) {
    login = 'email';
  }

  User.findOne({ [login]: username })
    .then(user => {
      if (!user) {
        errors.login = 'Incorrect username and password combination';
        return res.status(404).json(errors);
      }

      // Check passwords
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // User matched
            // Create JWT Payload
            const payload = {
              id: user._id,
              name: user.name,
              username: user.username
            };

            // Sign token
            jwt.sign(payload, secret, { expiresIn: 3600 }, (err, token) => {
              if (err) next(err);
              res.json({
                success: true,
                token: `Bearer ${token}`
              });
            });
          } else {
            errors.login = 'Incorrect username and password combination';
            return res.status(400).json(errors);
          }
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log('req user in current route', req.user);
    res.json({
      id: req.user._id,
      name: req.user.name,
      username: req.user.username,
      email: req.user.email
    });
  }
);

module.exports = router;
