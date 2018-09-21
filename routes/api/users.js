const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../../config/keys').secretOrKey;
const passport = require('passport');

// Load validation functions
const validateRegisterInput = require('../../validation/register');

// Load User Model
const User = require('../../models/User');

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  res.json({ message: 'Register validation was successfully' });
});

module.exports = router;