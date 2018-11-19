const express = require('express');
const router = express.Router();

// @route   GET api/tweets/comment/:tweet_id
// @desc    Comment another tweet (create new tweet and add it's ID to tweet that is commented)
// @access  Private
