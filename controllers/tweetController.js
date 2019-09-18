const { body, validationResult } = require('express-validator');
const charLengthForProps = require('../helpers/charLengthForProps');

const Tweet = require('../models/Tweet');
const User = require('../models/User');
const Profile = require('../models/Profile');

exports.getTweets = async (req, res, next) => {
    try {
        const tweets = await Tweet.find({})
            .sort({ created: -1 })
            .populate('user', ['name', 'username', 'avatar']);

        res.json(tweets);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.getUserTweets = async (req, res, next) => {
    const { user_id } = req.params;

    try {
        const user = await User.findOne({ _id: user_id });
        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'User does not exists' }]  });
        }

        const tweets = await Tweet.find({ user: user_id, comment: false })
            .sort({ created: -1 })
            .populate('user', ['name', 'username', 'avatar']);

        res.json(tweets);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'User does not exists' }]  });
        }
        next(err);
    }
};

exports.getProfilesHomepageTweets = async (req, res, next) => {
    try {
        const { homepageTweets } = await Profile.findOne({ user: req.user.id }).select('homepageTweets');
        const tweets = await Tweet.find({
            _id: { $in: homepageTweets }
        })
            .sort({ created: -1 })
            .populate('user', ['name', 'username', 'avatar']);

        res.json(tweets);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.getTweetById = async (req, res, next) => {
    const { tweet_id } = req.params;

    try {
        const tweet = await Tweet.findById(tweet_id).populate('user', [
            'name',
            'username',
            'avatar'
        ]);
        if (!tweet) {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }]});
        }
        res.json(tweet);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }]});
        }
        next(err);
    }
};

exports.createTweet = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    const tweetContent = { text: req.body.text };

    if (req.body.media) {
        tweetContent.media = req.body.media;
    }

    try {
        const newTweet = new Tweet(tweetContent);
        newTweet.user = req.user.id;
        const savedTweet = await newTweet.save();
        const tweet = await Tweet.populate(savedTweet, {
            path: 'user',
            select: ['name', 'username', 'avatar']
        });

        // User created a tweet, add a reference (tweet_id) to user profile.tweets array, and to every follower profile.homepageTweets array
        const { followers } = await Profile.findOne({ user: req.user.id }).select('followers');

        await Profile.updateOne(
            { user: req.user.id },
            { $push: { tweets: tweet.id, homepageTweets: tweet.id } }
        );

        await Profile.updateMany(
            { user: { $in: followers } },
            { $push: { homepageTweets: tweet.id } }
        );

        res.json(tweet);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.updateTweet = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    const { tweet_id } = req.params;

    try {
        const tweet = await Tweet.findById(tweet_id);
        if (!tweet) {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }]});
        }

        if (req.user.id !== tweet.user.toString()) {
            return res
                .status(401)
                .json({ errors: [{ msg: 'You cannot update the tweet' }] });
        }

        const newTweet = {
            text: req.body.text,
            editted: true
        };

        if (req.body.media) {
            newTweet.media = req.body.media;
        }

        const savedTweet = await Tweet.findByIdAndUpdate(
            tweet_id,
            { $set: newTweet },
            { new: true }
        ).populate('user', ['name', 'username', 'avatar']);

        res.json(savedTweet);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }] });
        }
        next(err);
    }
};

exports.deleteTweet = async (req, res, next) => {
    const { tweet_id } = req.params;

    try {
        const tweet = await Tweet.findById(tweet_id);

        if (!tweet) {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }]});
        }

        if (req.user.id !== tweet.user.toString()) {
            return res
                .status(401)
                .json({ errors: [{ msg: 'You are not allowed to delete that tweet' }] });
        }

        // Delete tweet
        await tweet.remove();
        await Tweet.updateMany(
            { _id: tweet_id },
            { $pull: { comments: tweet_id}}
        );
        await Profile.updateOne(
            { user: req.user.id },
            { $pull: { tweets: tweet_id, homepageTweets: tweet_id, likes: tweet_id } }
        );

        const { followers } = await Profile.findOne({ user: req.user.id }).select('followers');
        await Profile.updateMany(
            { user: { $in: followers } },
            { $pull: { homepageTweets: tweet_id, likes: tweet_id } }
        );

        res.json(tweet);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }]});
        }
        next(err);
    }
};

exports.getProfileLikes = async (req, res, next) => {
    const { user_id } = req.params;

    try {
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'User does not exists' }] });
        }
        const profile = await Profile.findOne({ user: user_id });
        if (!profile) {
            return res.status(404).json({ errors: [{ msg: 'Profile does not exists' }] });
        }

        const tweets = await Tweet.find({
            _id: { $in: profile.likes }
        }).populate('user', ['name', 'username', 'avatar']);

        res.json(tweets);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'User does not exists' }] });
        }
        next(err);
    }
};

exports.toggleTweetLike = async (req, res, next) => {
    const { tweet_id } = req.params;

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const tweet = await Tweet.findById(tweet_id).populate('user', [
            'name',
            'username',
            'avatar'
        ]);

        if (!tweet) {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }] });
        }
        const index = tweet.likes.findIndex(like => like.equals(profile.user));
        if (index > -1) {
            // User already like this tweet, unlike
            tweet.likes = tweet.likes.filter(like => !like.equals(profile.user));
            profile.likes = profile.likes.filter(like => !like.equals(tweet_id));
        } else {
            // Like
            tweet.likes = [profile.user, ...tweet.likes];
            profile.likes = [tweet_id, ...profile.likes];
        }

        await tweet.save();
        await profile.save();

        res.json(tweet);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }] });
        }
        next(err);
    }
};

/*
exports.retweetTweet = async (req, res, next) => {
    const { tweet_id } = req.params;

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ errors: [{ msg: 'Profile does not exists' }] });
        }

        const tweet = await Tweet.findById(tweet_id);

        if (!tweet) {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }] });
        }

        const index = tweet.retweets.findIndex(user => user.equals(req.user.id));
        if (index > -1) {
            return res.status(400).json({ errors: [{ msg: 'You have already retweeted that tweet' }] });
        } else {
            tweet.retweets = [...tweet.retweets, req.user.id];
        }


        const savedTweet = await new Tweet(newTweetContent).save();
        const retweetedTweet = await Tweet.populate(savedTweet, {
            path: 'user',
            select: ['name', 'username', 'avatar']
        });

        await Profile.updateOne(
            { user: req.user.id },
            { $push: { tweets: retweetedTweet.id, homepageTweets: retweetedTweet.id } }
        );

        await Profile.updateMany(
            { user: { $in: profile.followers } },
            { $push: { homepageTweets: retweetedTweet.id } }
        );

        await profile.save();

        res.json(retweetedTweet);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Tweet does not exists' }] });
        }
        next(err);
    }
};
*/

exports.validate = method => {
    switch(method) {
        case 'createTweet':
        case 'updateTweet': {
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