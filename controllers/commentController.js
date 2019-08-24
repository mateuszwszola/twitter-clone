const { validationResult } = require('express-validator');
const Tweet = require('../models/Tweet');

exports.createComment = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    const { tweet_id } = req.params;

    try {
        const tweet = await Tweet.findById(tweet_id);

        if (!tweet) {
            return res.status(404).json({ errors: [{ msg: 'Tweet not found' }]  });
        }

        const tweetContent = {
            text: req.body.text
        };
        // Add optional media property if exists
        if (req.body.media) {
            tweetContent.media = req.body.media;
        }
        const newTweet = new Tweet(tweetContent);
        newTweet.user = req.user.id;
        const savedTweet = await newTweet.save();

        tweet.comments = [savedTweet._id, ...tweet.comments];
        await tweet.save();
        res.json(tweet);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Tweet not found' }] });
        }
    }
};