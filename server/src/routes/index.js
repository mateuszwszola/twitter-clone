const express = require('express');
const { auth: authRoutes } = require('../components');

const router = express.Router();

router.use('/auth', authRoutes);

module.exports = router;
