const express = require('express');
const { auth } = require('../components');
const { users } = require('../components');
const { profiles } = require('../components');

const router = express.Router();

router.use('/auth', auth.authRoutes);
router.use('/users', users.userRoutes);
router.use('/profiles', profiles.profileRoutes);

module.exports = router;
