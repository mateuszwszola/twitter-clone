const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');
const mongoose = require('mongoose');

// @route   GET api/profiles/
// @desc    Get logged in user profile
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
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

// @route   GET api/profiles/:profielId
// @desc    Get profile by Id
// @access  Public

module.exports = router;
