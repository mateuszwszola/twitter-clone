const express = require('express');
const router = express.Router();

// @route   POST api/profiles/
// @desc    Test the route
// @access  Public
router.get('/', (req, res, next) => {
  res.json({ message: "Profiles router" });
});

module.exports = router;