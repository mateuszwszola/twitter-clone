const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../../models/Profile');
const Tweet = require('../../../models/Tweet');
const User = require('../../../models/User');

// Load additional routers
const followRouter = require('./follow');

// Load validation functions
const validateProfileInput = require('../../../validation/profile');
const validateObjectId = require('../../../validation/objectId');
// Load helper functions
const startCase = require('../../../helpers/startCase');

router.use('/follow', followRouter);

// @route   GET api/profiles/
// @desc    Get logged in user profile
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const errors = {};

    Profile.findOne({ user: req.user._id })
      .populate('user', ['name', 'username', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(err => next(err));
  }
);

// @route   GET api/profiles/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res, next) => {
  const errors = {};

  Profile.find({})
    .sort({ created: -1 })
    .populate('user', ['name', 'username', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofiles = 'There is no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => next(err));
});

// @route   GET api/profiles/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/:user_id', (req, res, next) => {
  const { user_id } = req.params;
  const errors = {};

  const { idErrors, isValidObjectId } = validateObjectId(user_id);
  if (!isValidObjectId) {
    return res.status(400).json(idErrors);
  }

  Profile.findOne({ user: user_id })
    .populate('user', ['name', 'username', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => next(err));
});

// @route   GET api/profiles/profile/:username
// @desc    Get profile by username
// @access  Public
router.get('/profile/:username', (req, res, next) => {
  const { username } = req.params;
  const errors = {};

  User.findOne({ username })
    .then(user => {
      if (!user) {
        errors.nouser = `User ${username} does no exists`;
        return res.status(404).json(errors);
      }

      Profile.findOne({ user: user._id })
        .populate('user', ['name', 'username', 'avatar'])
        .then(profile => {
          if (!profile) {
            errors.noprofile = `Profile for ${username} does not exists`;
            return res.status(404).json(errors);
          }
          res.json(profile);
        });
    })
    .catch(err => next(err));
});

// @route   POST api/profiles/
// @desc    Create or update user PROFILE
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    // For this route, validate and create or update only string information about profile (bio, location, website, ...)
    // For things like followers, likes, tweets will be different routes
    // !INCLUDE ability to change name

    // 1. Validate req.body
    // 2. Check if update profile or create new profile for the user
    const { errors, isValid } = validateProfileInput(req.body);
    const response = {};

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Validation before checks if name exists, if value is empty and if it is alphanumeric, so here I only check if property name in req.body is "something" in order to change it
    if (req.body['name']) {
      User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { name: startCase(req.body['name']) } },
        { new: true }
      )
        .then(updatedUser => {
          if (!updatedUser) {
            errors.name = 'There was a problem with updating the user name';
            return res.status(500).json(errors);
          }
          console.log('Name in user profile has been updated');
          response['updatedUser'] = updatedUser;
        })
        .catch(err => next(err));
    }

    const profileFields = {};
    profileFields.user = req.user._id;
    const standardFields = [
      'bio',
      'location',
      'website',
      'birthday',
      'backgroundPicture',
      'created'
    ];

    standardFields.forEach(field => {
      if (req.body[field]) {
        profileFields[field] = req.body[field];
      }
    });

    Profile.findOne({ user: req.user._id }).then(profile => {
      if (profile) {
        // Update the profile
        Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: profileFields },
          { new: true }
        )
          .then(updatedProfile => {
            response['updatedProfile'] = updatedProfile;
            res.json(response);
          })
          .catch(err => next(err));
      } else {
        // Create profile
        const newProfile = new Profile(profileFields);
        newProfile
          .save()
          .then(createdProfile => {
            if (!createdProfile) {
              errors.profilenotcreated =
                'There was a problem with creating new profile';
              return res.status(500).json(errors);
            }
            response['createdProfile'] = createdProfile;
            res.json(response);
          })
          .catch(err => next(err));
      }
    });
  }
);

// @route   DELETE api/profiles/
// @desc    Delete user account (profile and user)
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const errors = {};
    // Find profile, delete it, find user, delete it
    Profile.findOneAndDelete({ user: req.user._id })
      .then(deletedProfile => {
        // If profile doesn't exists, doesn't matter. This deletes profile and user, if profile doesn't exists it deletes only user.
        User.findOneAndDelete({ _id: req.user._id })
          .then(deletedUser => {
            // But if there is no deletedUser I want to inform about it
            if (!deletedUser) {
              errors.nouser = 'User with that ID does not exists';
              return res.status(404).json(errors);
            }
            res.json({
              message: 'Successfully deleted the user account!',
              deletedProfile,
              deletedUser
            });
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  }
);

// @route   GET api/profiles/homepageTweets/all
// @desc    Get all tweets from profile.homepageTweets to display them in the profile homepage
// @access  Private
router.get(
  '/homepageTweets/all',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const errors = {};

    Profile.findOne({ user: req.user._id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'Profile does not exists';
          return res.status(404).json(errors);
        }

        let homepageTweets = profile.homepageTweets.map(
          homepageTweet => homepageTweet.tweet
        );

        Tweet.find({ _id: { $in: homepageTweets } })
          .populate('user', ['name', 'username', 'avatar'])
          .sort({ created: -1 })
          .then(tweets => res.json(tweets))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  }
);

module.exports = router;
