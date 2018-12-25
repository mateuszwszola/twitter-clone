// @route   /api
const mongoose = require('mongoose');
const router = require('express').Router();

const usersRouter = require('./users');
const profilesRouter = require('./profiles');
const tweetsRouter = require('./tweets');

router.use('/users', usersRouter);
router.use('/profiles', profilesRouter);
router.use('/tweets', tweetsRouter);

module.exports = router;
