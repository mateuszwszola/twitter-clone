const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/keys');
const passport = require('passport');
const validator = require('validator');

// Load validation functions
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
// Load helper functions
const startCase = require('../../helpers/startCase');

// Load Models
const User = require('../../models/User');
const Profile = require('../../models/Profile');

const saltRounds = 10;

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post('/register', (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { name, email, password, username } = req.body;

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
            name: startCase(name), // (start case, john doe -> John Doe)
            username,
            email,
            password
          });

          // Create empty profile for that user
          const newProfile = new Profile({});

          // Hash the password
          bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
              return next(err);
            }

            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                return next(err);
              }

              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  // Fill newProfile with user id
                  newProfile.user = user._id;
                  newProfile
                    .save()
                    .then(profile => {
                      res.json({ message: 'Successfully created an account!' });
                    })
                    .catch(err => next(err));
                })
                .catch(err => next(err));
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
        return res.status(400).json(errors);
      }

      // Check passwords
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return next(err);
        }

        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          };
          // Sign token
          jwt.sign(payload, jwtSecret, { expiresIn: 3600 }, (err, token) => {
            if (err) return next(err);
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          });
        } else {
          errors.login = 'Incorrect username and password combination';
          return res.status(400).json(errors);
        }
      });
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
