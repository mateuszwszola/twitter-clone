const express = require('express');
const { auth } = require('../components');
const { users } = require('../components');

const router = express.Router();

router.use('/auth', auth.authRoutes);
router.use('/users', users.userRoutes);

module.exports = router;
