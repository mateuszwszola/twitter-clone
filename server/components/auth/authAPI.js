const router = require('express').Router();
const authController = require('./authController');
const authValidate = require('./authValidate');

/**
 * @route   POST api/auth/register
 * @desc    Register user | Return JWT
 * @access  Public
 */
router.post('/register', authValidate.register(), authController.registerUser);

/**
 * @route   POST api/users/login
 * @desc    Login user | Return JWT
 * @access  Public
 */
router.post('/login', authValidate.login(), authController.loginUser);
