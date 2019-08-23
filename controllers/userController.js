const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const startCase = require('../helpers/startCase');
const charLengthForProps = require('../helpers/charLengthForProps');
const { JWT_SECRET } = require('../config/keys');
// Load Models
const User = require('../models/User');
const Profile = require('../models/Profile');

const { body, validationResult } = require('express-validator');
const validator = require('validator');

const SALT_ROUNDS = 10;

exports.validate = method => {
    switch(method) {
        case 'registerUser': {
            return [
                body('name')
                    .exists()
                    .trim()
                    .isLength(charLengthForProps.name)
                    .withMessage(`The name must be between ${charLengthForProps.name.min} and ${charLengthForProps.name.max} chars`)
                    .custom(value => {
                        if (!validator.isAlphanumeric(value.split(' ').join(''))) {
                            return Promise.reject('Invalid name')
                        }
                    }),
                body('username')
                    .exists()
                    .trim()
                    .isLength(charLengthForProps.username)
                    .withMessage(`The username must be between ${charLengthForProps.username.min} and ${charLengthForProps.username.max} chars`)
                    .customSanitizer(value => {
                        return value.split(' ').join('')
                    }),
                body('email')
                    .exists()
                    .isEmail()
                    .trim()
                    .normalizeEmail(),
                body('password')
                    .exists()
                    .isLength(charLengthForProps.password)
                    .withMessage(`The password must be between ${charLengthForProps.password.min} and ${charLengthForProps.password.max} chars`)
                    .matches(/\d/).withMessage('The password must contain a number')
                    .custom((value, { req }) => {
                        if (value !== req.body.password2) {
                            throw new Error('Password confirmation is incorrect');
                        }
                    }),
                body('password2', 'Confirmation password is required')
                    .exists()
            ];
        }
        case 'loginUser': {
            return [
                body('username', 'Username field is required')
                    .exists(),
                body('password', 'Password is required')
                    .exists()
            ]
        }
    }
};

exports.getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password, username } = req.body;

    try {
        // Check if user with that email/username already exists in db
        let user = await User.findOne({ email });
        if (user) {
            errors.email = 'User with that email has already been created';
            return res.status(400).json(errors);
        }

        user = await User.findOne({ username });
        if (user) {
            errors.username = 'User with that username has already been created';
            return res.status(400).json(errors);
        }

        // There is no user with that email/username in db, create the user
        user = new User({
            name: startCase(name), // (start case, john doe -> John Doe)
            username,
            email,
            password
        });

        // Create empty profile for that user
        const profile = new Profile({});

        // Hash the password
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        profile.user = user._id;
        await profile.save();

        // Create JWT payload
        const payload = {
            user: {
                id: user.id
            }
        };
        // Sign token
        jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) return next(err);
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    /*
      1. Server will receive username and password
      2. Username can be user username or email
      3. Check if username is user username or email
    */
    let login = 'username';
    if (validator.isEmail(username)) {
        login = 'email';
    }

    try {
        const user = await User.findOne({ [login]: username });
        if (!user) {
            errors.login = 'Incorrect username and password combination';
            return res.status(400).json(errors);
        }

        // Check passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            errors.login = 'Incorrect username and password combination';
            return res.status(400).json(errors);
        }

        // User matched
        // Create JWT Payload
        const payload = {
            user: {
                id: user.id
            }
        };
        // Sign token
        jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) return next(err);
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const user = await User.findById(user_id).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        next(err);
    }
};