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
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }]  });
        }

        const commentBody = {
            text: req.body.text
        };
        // Add optional media property if exists
        if (req.body.media) {
            commentBody.media = req.body.media;
        }
        const comment = new Tweet(commentBody);
        comment.user = req.user.id;
        let savedComment = await comment.save();

        tweet.comments = [savedComment._id, ...tweet.comments];
        await tweet.save();

        savedComment = await Tweet.populate(savedComment, { path: 'user', select: ['name', 'username', 'avatar'] });

        res.json(savedComment);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }] });
        }
    }
};