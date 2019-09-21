const { body, validationResult } = require('express-validator');
const charLengthForProps = require('../helpers/charLengthForProps');
const { isEmpty } = require('lodash');

const Tweet = require('../models/Tweet');
const TweetComment = require('../models/TweetComment');
const Profile = require('../models/Profile');

exports.getComments = async (req, res, next) => {
    const { tweet_id } = req.params;

    try {
        const tweet = await Tweet.findById(tweet_id);
        if (!tweet) {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }]  });
        }

        const comments = await Tweet.find({ _id: { $in: tweet.comments }})
            .sort({ created: -1 })
            .populate('user', ['name', 'username', 'avatar']);

        res.json(comments);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }] });
        }
        next(err);
    }
};

exports.createComment = async (req, res, next) => {
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
            user: req.user.id,
            text: req.body.text,
        };
        // Add optional media property if exists
        if (req.body.hasOwnProperty('media') && !isEmpty(req.body.media)) {
            commentBody.media = req.body.media;
        }
        let comment = await new TweetComment(commentBody).save();

        tweet.comments = [comment._id, ...tweet.comments];
        await tweet.save();

        comment = await Tweet.populate(comment, { path: 'user', select: ['name', 'username', 'avatar'] });

        res.json(comment);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }] });
        }
        next(err);
    }
};

exports.updateComment = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    const { comment_id } = req.params;

    try {
        const comment = await TweetComment.findById(comment_id);

        if (!comment) {
            return res.status(404).json({ errors: [{ msg: 'Comment does not exists' }]  });
        }

        if (req.user.id !== comment.user.toString()) {
            return res
                .status(401)
                .json({ errors: [{ msg: 'You cannot update the comment' }] });
        }

        const commentBody = {
            text: req.body.text,
        };
        // Add optional media property if exists
        if (req.body.hasOwnProperty('media') && !isEmpty(req.body.media)) {
            commentBody.media = req.body.media;
        }

        const updatedComment = await TweetComment.findByIdAndUpdate(
            comment_id,
            { $set: commentBody },
            { new: true }
        ).populate('user', ['name', 'username', 'avatar']);

        res.json(updatedComment);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }] });
        }
        next(err);
    }
};

exports.deleteComment = async (req, res, next) => {
    const { comment_id } = req.params;

    try {
        const comment = await TweetComment.findById(comment_id);

        if (!comment) {
            return res.status(404).json({ errors: [{ msg: 'Comment does not exists' }]});
        }

        if (req.user.id !== comment.user.toString()) {
            return res
                .status(401)
                .json({ errors: [{ msg: 'You are not allowed to delete that comment' }] });
        }

        // Delete comment
        await comment.remove();
        // Remove comment reference from tweet comments array
        await Tweet.updateOne(
            { _id: comment.tweet },
            { $pull: { comments: comment_id }}
        );
        // Pull comment references from profiles
        await Profile.updateMany({},
            { $pull: { likes: comment_id } }
        );

        res.json(comment);
    } catch(err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Comment does not exists' }]});
        }
        next(err);
    }
};

exports.validate = method => {
    switch(method) {
        case 'createComment':
        case 'updateComment': {
            return [
                body('text')
                    .not()
                    .isEmpty()
                    .withMessage('Text field is required')
                    .trim()
                    .escape()
                    .isLength(charLengthForProps.tweet)
                    .withMessage(`Text field must be between ${charLengthForProps.tweet.min} and ${charLengthForProps.tweet.max} chars`),
                body('media')
                    .optional({ checkFalsy: true })
                    .isURL()
                    .withMessage('The media must be a URL')
            ]
        }
    }
};