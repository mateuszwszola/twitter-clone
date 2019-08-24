const { body, validationResult } = require('express-validator');

const Profile = require('../models/Profile');
const Tweet = require('../models/Tweet');
const User = require('../models/User');
const startCase = require('../helpers/startCase');
const charLengthForProps = require('../helpers/charLengthForProps');
const validateBirthday = require('../validation/birthday');

exports.getLoggedInUserProfile = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user',
            ['name', 'username', 'avatar']
        );

        if (!profile) {
            return res.status(404).json({ errors: [{ msg: 'Profile does not exists' }]});
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
            return res.status(404).json({ errors: [{ msg: 'Profile Not Found' }]});
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
            return res.status(404).json({ errors: [{ msg: 'Profile Not Found' }]});
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
            return res.status(404).json({ errors: [{ msg: 'Profile not found' }]});
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Profile not found' }]});
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
                .json({ errors: [{ msg: 'User with that username does not exists' }]});
        }
        const profile = await Profile.findOne({ user: user.id }).populate('user', [
            'name',
            'username',
            'avatar'
        ]);
        if (!profile) {
            return res
                .status(404)
                .json({ errors: [{ msg: `Profile for ${username} does not exists` }]});
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
                .json({ errors: [{ msg: 'User with that username does not exists' }]});
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
                .json({ errors: [{ msg: 'Profile with that username does not exists' }] });
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
        return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
    }

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
            'backgroundPicture'
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
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'User Not Found' }]})
        }

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

exports.validate = method => {
    switch(method) {
        case 'updateProfile': {
            return [
                body('bio')
                    .optional({ checkFalsy: true })
                    .trim()
                    .isLength(charLengthForProps.bio)
                    .withMessage(`The bio must be between ${charLengthForProps.bio.min} and ${charLengthForProps.bio.max} chars long`)
                    .escape(),
                body('location')
                    .optional({ checkFalsy: true })
                    .trim()
                    .isLength(charLengthForProps.location)
                    .withMessage(`The location must be between ${charLengthForProps.location.min} and ${charLengthForProps.location.max} chars long`),
                body('website')
                    .optional({ checkFalsy: true })
                    .trim()
                    .isLength(charLengthForProps.website)
                    .withMessage(`The website must be between ${charLengthForProps.website.min} and ${charLengthForProps.website.max} chars long`)
                    .isURL()
                    .withMessage('Website must be a valid URL'),
                body('birthday', 'Birthday must be a valid date')
                    .optional({ checkFalsy: true })
                    .custom(validateBirthday),
                body('avatar', 'Avatar must be a URL')
                    .optional({ checkFalsy: true })
                    .isURL(),
                body('backgroundPicture', 'Background picture must be a URL')
                    .optional({ checkFalsy: true })
                    .isURL(),
                body('name', 'The name must be a valid name')
                    .optional()
                    .isLength(charLengthForProps.name)
                    .withMessage(`The name must be between ${charLengthForProps.name.min} and ${charLengthForProps.name.max} chars long`),
                body('username', 'The username must be a valid username')
                    .optional()
                    .isLength(charLengthForProps.username)
                    .withMessage(`The username must be between ${charLengthForProps.username.min} and ${charLengthForProps.username.max} chars long`)
                    .custom(value => {
                        const username = value.toString().split(' ').join('');
                        return User.findOne({ username }).then(user => {
                            if (user) {
                                return Promise.reject('username already in use')
                            }
                        });
                    })
                    .customSanitizer(value => {
                        return value.split(' ').join('')
                    })
            ]
        }
    }
};