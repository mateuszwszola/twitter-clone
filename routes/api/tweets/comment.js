const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const Tweet = require('../../../models/Tweet');

// Load validation functions
const validateTweet = require('../../../validation/createTweet');

// @route   POST api/tweets/comment/:tweet_id
// @desc    Comment another tweet (create new tweet and add it's ID to tweet that is commented)
// @access  Private
router.post('/:tweet_id', auth, async (req, res, next) => {
  // Validate tweet id param
  const { tweet_id } = req.params;

  const { isValid, errors } = validateTweet(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    const tweet = await Tweet.findById(tweet_id);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    const tweetContent = {
      text: req.body.text
    };
    // Add optional media property if exists
    if (req.body.media) {
      tweetContent.media = req.body.media;
    }
    const newTweet = new Tweet(tweetContent);
    // Add user property to indicate the owner of the tweet
    newTweet.user = req.user.id;
    const savedTweet = await newTweet.save();
    // Add created tweet id to Tweet which is commented comments
    tweet.comments = [{ tweet: savedTweet._id }, ...tweet.comments];
    await tweet.save();
    res.json(tweet);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tweet not found' });
    }
  }
});

module.exports = router;
