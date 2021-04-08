const router = require('express').Router();
const authController = require('./authController');
const authValidation = require('./authValidation');
const validate = require('../../middleware/validate');

/**
 * @route   POST api/auth/register
 * @desc    Register user | Return JWT
 * @access  Public
 */
router.post(
  '/register',
  validate(authValidation.register),
  authController.registerUser
);

/**
 * @route   POST api/users/login
 * @desc    Login user | Return JWT
 * @access  Public
 */
router.post('/login', validate(authValidation.login), authController.loginUser);

module.exports = router;
