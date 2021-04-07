const express = require('express');
const { auth: authRoutes } = require('../components');
const { users: usersRoutes } = require('../components');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

module.exports = router;
