const { check, validationResult } = require('express-validator');

const Profile = require('../models/Profile');

exports.getProfileFollowersList = async (req, res, next) => {
    const { user_id } = req.params;

    try {
        const { followers } = await Profile.findOne({ user: user_id }).select('followers');
        const profiles = await Profile.find({
            user: { $in: followers }
        }).populate('user', ['name', 'username', 'avatar']);

        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Profile does not exists' }] });
        }
        next(err);
    }
};

exports.getProfileFollowingList = async (req, res, next) => {
    const { user_id } = req.params;

    try {
        const { following } = await Profile.findOne({ user: user_id }).select('following');
        const profiles = await Profile.find({
            user: { $in: following }
        }).populate('user', ['name', 'username', 'avatar']);

        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Profile does not exists' }] });
        }
        next(err);
    }
};

exports.followUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    const { user_id } = req.params;

    try {
        const userProfile = await Profile.findOne({ user: req.user.id });
        const profileToFollow = await Profile.findOne({ user: user_id });

        if (!profileToFollow) {
            return res.status(400).json({ errors: [{ msg: 'Profile does not exists' }] });
        }

        const index = userProfile.following.findIndex(
            user => user.toString() === user_id
        );

        if (index > -1) {
            return res.status(400).json({ errors: [{ msg: 'You have already followed that profile' }]});
        } else {
            userProfile.following = [user_id, ...userProfile.following];
            profileToFollow.followers = [req.user.id, ...profileToFollow.followers];
        }

        await userProfile.save();
        await profileToFollow.save();

        res.json(userProfile);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Profile to follow does not exists' }] });
        }
        next(err);
    }
};

exports.unfollowUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    const { user_id } = req.params;

    try {
        const userProfile = await Profile.findOne({ user: req.user.id });
        const profileToFollow = await Profile.findOne({ user: user_id });

        if (!profileToFollow) {
            return res.status(404).json({ errors: [{ msg: 'Following profile does not exists' }] });
        }

        const index = userProfile.following.findIndex(
            user => user.toString() === user_id
        );
        if (index > -1) {
            userProfile.following = userProfile.following.filter(
                follow => follow.toString() !== user_id
            );
            profileToFollow.followers = profileToFollow.followers.filter(
                follower => follower.toString() !== req.user.id
            );
        } else {
            return res.status(400).json({ errors: [{ msg: 'You cannot unfollow that profile' }] });
        }

        await userProfile.save();
        await profileToFollow.save();

        res.json(userProfile);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ errors: [{ msg: 'Profile to follow does not exists' }] });
        }
        next(err);
    }
};

exports.validate = method => {
    switch(method) {
        case 'followUser':
            return [
                check('user_id').custom((value, { req }) => {
                    if (value === req.user.id) {
                        throw new Error('You cannot follow your own profile');
                    }

                    return true;
                })
            ];
        case 'unfollowUser':
            return [
                check('user_id').custom((value, { req }) => {
                    if (value === req.user.id) {
                        throw new Error('You cannot unfollow your own profile');
                    }

                    return true;
                })
            ]
    }
};