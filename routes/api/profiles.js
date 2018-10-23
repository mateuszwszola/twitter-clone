const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const mongoose = require('mongoose');

// Load validation functions
const validateProfileInput = require('../../validation/profile');

// @route   GET api/profiles/
// @desc    Get logged in user profile
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const errors = {};

    Profile.findOne({ user: req.user._id })
      .populate('user', ['name', 'username', 'date'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(err => {
        next(err);
      });
  }
);

// @route   GET api/profiles/:profileID
// @desc    Get profile by ID
// @access  Public
router.get('/:user_id', (req, res, next) => {
  const { user_id } = req.params;
  const errors = {};

  if (!user_id.match(/^[0-9a-fA-F]{24}$/)) {
    // user_id is not valid ObjectId, findOne with this value will cause an error
    errors.objectid = `user_id ${user_id} is not a valid ObjectId`;
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: user_id })
    .populate('user', ['name', 'username', 'date'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => {
      next(err);
    });
});

// @route   POST api/profiles/
// @desc    Create or update user PROFILE
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    if (req.body['name'] && req.body['name'] !== undefined) {
      User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { name: req.body['name'] } },
        { new: true }
      )
        .then(updatedUser =>
          console.log('Name in user profile has been updated')
        )
        .catch(err => next(err));
    }

    const profileFields = {};
    profileFields.user = req.user._id;
    const standardFields = ['bio', 'location', 'website', 'birthday'];

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
          .then(updatedProfile => res.json(updatedProfile))
          .catch(err => next(err));
      } else {
        // Create profile
        const newProfile = new Profile(profileFields);
        newProfile
          .save()
          .then(createdProfile => res.json(createdProfile))
          .catch(err => next(err));
      }
    });

    // For this route, validate and create or update only string information about profile (bio, location, website, ...)
    // For things like followers, likes, tweets will be different routes
    // !INCLUDE ability to change name

    // 1. Validate req.body
    // 2. Check if update profile or create new profile for the user
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
    // Find profile, delete it, find user, delete if
    const response = {};
    Profile.findOneAndDelete({ user: req.user._id })
      .then(deletedProfile => {
        response['deletedProfile'] = deletedProfile;
        User.findOneAndDelete({ _id: req.user._id })
          .then(deletedUser => {
            response['deletedUser'] = deletedUser;
            res.json({
              message: 'Successfully deleted the user account!',
              data: response
            });
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  }
);

module.exports = router;
