const express = require('express');
const { auth } = require('../components');
const { users } = require('../components');
const { profiles } = require('../components');
const { tweets } = require('../components');

function getRoutes() {
  const router = express.Router();

  router.use('/auth', auth.authRoutes);
  router.use('/users', users.userRoutes);
  router.use('/profiles', profiles.profileRoutes);
  router.use('/tweets', tweets.tweetRoutes);

  return router;
}

module.exports = { getRoutes };
