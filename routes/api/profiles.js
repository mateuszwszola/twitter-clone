const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const mongoose = require('mongoose');

// Load validation functions
const validateProfileInput = require('../../validation/profile');
const validateObjectId = require('../../validation/objectId');
// Load utils functions
const formatName = require('../../utils/formatName');

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

// @route   GET api/profiles/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res, next) => {
  const errors = {};

  Profile.find({})
    .populate('user', ['name', 'username', 'date'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofiles = 'There is no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => {
      next(err);
    });
});

// @route   GET api/profiles/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/:user_id', (req, res, next) => {
  const { user_id } = req.params;
  const errors = {};

  const { idErrors, isValid } = validateObjectId(user_id);
  if (!isValid) {
    return res.status(400).json(idErrors);
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
    .catch(err => next(err));
});

// @route   POST api/profiles/
// @desc    Create or update user PROFILE
// @access  Private

// For this route, validate and create or update only string information about profile (bio, location, website, ...)
// For things like followers, likes, tweets will be different routes
// !INCLUDE ability to change name

// 1. Validate req.body
// 2. Check if update profile or create new profile for the user

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { errors, isValid } = validateProfileInput(req.body);
    const response = {};

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Validation before checks if name exists, if value is empty and if it is alphanumeric, so here I only check if property name in req.body is "something" in order to change it
    if (req.body['name']) {
      User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { name: formatName(req.body['name']) } },
        { new: true }
      )
        .then(updatedUser => {
          if (!updatedUser) {
            errors.name = 'There was a problem with updating the name';
            return res.status(400).json(errors);
          }
          console.log('Name in user profile has been updated');
          response['updatedUser'] = updatedUser;
        })
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
    const response = {};
    Profile.findOneAndDelete({ user: req.user._id })
      .then(deletedProfile => {
        // If profile doesn't exists, doesn't matter. This deletes profile and user, if profile doesn't exists it deletes only user.
        response['deletedProfile'] = deletedProfile;
        User.findOneAndDelete({ _id: req.user._id })
          .then(deletedUser => {
            // But if there is no deletedUser I want to inform about it
            if (!deletedUser) {
              errors.user = 'User with that id does not exists';
              return res.status(404).json(errors);
            }
            response['deletedUser'] = deletedUser;
            res.json({
              message: 'Successfully deleted the user account!',
              deletedProfile: response['deletedProfile'],
              deletedUser: response['deletedUser']
            });
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  }
);

// @route   POST api/profiles/following/:user_id
// @desc    Add or remove following
// @access  Private
router.post(
  '/following/:user_id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    /*
    1. Every user have a profile (because when user register it also creates new empty profile)
    2. Check if authenticated user already follows profile with req.params.user_id
        Find user profile, loop through "following" array and check if there is profile with "user" equal to user_id param
          a) If yes => Remove it from array (unfollow)
          b) If not => Add it to the array (follow)
  */

    const errors = {};
    // user_id => The ID of a profile which authenticated user wants to follow
    // req.user._id => ID of authenticated user who want to follow/unfollow profile
    const { user_id } = req.params;

    // Validate user_id
    const { idErrors, isValid } = validateObjectId(user_id);
    if (!isValid) {
      return res.status(400).json(idErrors);
    }

    if (req.user._id === user_id) {
      return res.status(400).json({
        message: 'You cannot follow or unfollow your own profile'
      });
    }

    Profile.findOne({ user: req.user._id })
      .then(profile => {
        Profile.findOne({ user: user_id }).then(someoneProfile => {
          if (!someoneProfile) {
            errors.noprofile = 'There is no profile with that user ID';
            return res.status(400).json(errors);
          }

          const index = profile.following.findIndex(
            follow => follow.user == user_id
          );
          if (index > -1) {
            // Index was found => unfollow
            profile.following.splice(index, 1);
            profile
              .save()
              .then(savedProfile => {
                if (!savedProfile) {
                  errors.profile =
                    'There was a problem with saving that profile';
                  return res.status(400).json(errors);
                }

                res.json(savedProfile);
              })
              .catch(err => next(err));
          } else {
            // Index was not found => follow that profile
            profile.following.push(user_id);
            profile
              .save()
              .then(savedProfile => {
                if (!savedProfile) {
                  errors.noprofile =
                    'There was a problem with unfollowing that profile';
                  return res.status(400).json(errors);
                }

                res.json(savedProfile);
              })
              .catch(err => next(err));
          }
        });
      })
      .catch(err => next(err));
  }
);

module.exports = router;
