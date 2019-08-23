const { body, validationResult } = require('express-validator');

const Profile = require('../models/Profile');
const Tweet = require('../models/Tweet');
const User = require('../models/User');
const startCase = require("lodash");

exports.getLoggedInUserProfile = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user',
            ['name', 'username', 'avatar']
        );

        if (!profile) {
            return res.status(404).json({ msg: 'Profile does not exists' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.getLoggedInUserProfileWithHomepageTweets = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'username', 'avatar'])
            .populate({
                path: 'homepageTweets',
                populate: { path: 'user', select: ['name', 'username', 'avatar'] }
            });

        if (!profile) {
            return res.status(404).json({ message: 'Profile Not Found' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.getLoggedInUserProfileWithTweets = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'username', 'avatar'])
            .populate({
                path: 'tweets',
                populate: { path: 'user', select: ['name', 'username', 'avatar'] }
            });

        if (!profile) {
            return res.status(404).json({ message: 'Profile Not Found' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.getAllProfiles = async (req, res, next) => {
    try {
        const profiles = await Profile.find({})
            .sort({ created: -1 })
            .populate('user', ['name', 'username', 'avatar']);

        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.getProfileByUserId = async (req, res, next) => {
    const { user_id } = req.params;

    try {
        const profile = await Profile.findOne({ user: user_id }).populate('user', [
            'name',
            'username',
            'avatar'
        ]);

        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Profile not found' });
        }
        next(err);
    }
};

exports.getProfileByUsername = async (req, res, next) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(404)
                .json({ message: 'User with that username does not exists' });
        }
        const profile = await Profile.findOne({ user: user.id }).populate('user', [
            'name',
            'username',
            'avatar'
        ]);
        if (!profile) {
            return res
                .status(404)
                .json({ msg: `Profile for ${username} does not exists` });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.getProfileByUsernameWithTweets = async (req, res, next) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(404)
                .json({ message: 'User with that username does not exists' });
        }
        const profile = await Profile.findOne({ user: user.id })
            .populate('user', ['name', 'username', 'avatar'])
            .populate({
                path: 'tweets',
                populate: { path: 'user', select: ['name', 'username', 'avatar'] }
            });

        if (!profile) {
            return res
                .status(404)
                .json({ message: 'Profile with that username does not exists' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.updateProfile =  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Validation before checks if name exists, if value is empty and if it is alphanumeric, so here I only check if property name in req.body is "something" in order to change it
    try {
        if (req.body['name']) {
            await User.findOneAndUpdate(
                { _id: req.user.id },
                { $set: { name: startCase(req.body['name']) } },
                { new: true }
            );
        }
        if (req.body['avatar']) {
            await User.findOneAndUpdate(
                { _id: req.user.id },
                { $set: { avatar: req.body['avatar'] } },
                { new: true }
            );
        }

        const profileFields = {};
        profileFields.user = req.user.id;
        const standardFields = [
            'bio',
            'location',
            'website',
            'birthday',
            'avatar',
            'backgroundPicture',
            'created'
        ];

        standardFields.forEach(field => {
            if (req.body.hasOwnProperty(field)) {
                profileFields[field] = req.body[field];
            }
        });

        // Update the profile
        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
        ).populate('user', ['name', 'username', 'avatar']);

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.deleteAccount = async (req, res, next) => {
    try {
        await User.findByIdAndRemove(req.user.id);
        await Profile.findOneAndRemove({ user: req.user.id });

        res.json({ message: 'Success' });
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.getHomepageTweets = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ msg: 'Profile does not exists' });
        }

        const tweets = await Tweet.find({ id: { $in: profile.homepageTweets } })
            .populate('user', ['name', 'username', 'avatar'])
            .sort({ created: -1 });

        res.json(tweets);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

const lengthForProps = {
    bio: { min: 2, max: 70 },
    location: { min: 2, max: 30 },
    website: { min: 3, max: 30 },
    name: { min: 2, max: 30 },
    username: { min: 6, max: 15 }
};

exports.validate = method => {
    switch(method) {
        case 'updateProfile': {
            return [
                body('bio', `The bio must be between ${lengthForProps.bio.min} and ${lengthForProps.bio.max} chars long`)
                    .optional()
                    .trim()
                    .isLength(lengthForProps.bio)
                    .escape(),
                body('location', `The location must be between ${lengthForProps.location.min} and ${lengthForProps.location.max} chars long`)
                    .optional()
                    .trim()
                    .isLength(lengthForProps.location),
                body('website', `The website must be between ${lengthForProps.website.min} and ${lengthForProps.website.max} chars long`)
                    .optional()
                    .isLength(lengthForProps.website)
                    .isURL()
                    .withMessage('Website must be a valid URL'),
                body('birthday', 'Birthday must be a valid date')
                    .optional()
                    .toDate(),
                body('avatar', 'Avatar must be a URL')
                    .optional()
                    .isURL(),
                body('backgroundPicture', 'Background picture must be a URL')
                    .optional()
                    .isURL(),
                body('name', `The name must be between ${lengthForProps.name.min} and ${lengthForProps.name.max} chars long`)
                    .optional()
                    .isLength(lengthForProps.name)
                    .isAlpha()
                    .withMessage('The name must be a valid name'),
                body('username', `The username must be between ${lengthForProps.username.min} and ${lengthForProps.username.max} chars long`)
                    .optional()
                    .isLength(lengthForProps.username)
                    .isAlpha()
                    .withMessage('The username must be a valid username')
            ]
        }
        default:
            return null;
    }
};