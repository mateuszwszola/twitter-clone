const router = require('express').Router();
const userController = require('./user.controller');
const userValidation = require('./user.validation');
const auth = require('../../middleware/auth');

/**
 * @route   GET api/users
 * @desc    Get all users
 * @access  Admin
 */
router.get('/', auth('getUsers'), userValidation.getUsers, userController.getUsers);

/**
 * @route   GET api/users/:userId
 * @desc    Get user by id
 * @access  Owner, Admin
 */
router.get('/:userId', auth('getUsers'), userValidation.getUser, userController.getUserById);

/**
 * @route   POST api/users
 * @desc    Create user
 * @access  Admin
 */
router.post('/', auth('manageUsers'), userValidation.createUser, userController.createUser);

/**
 * @route   PATCH api/users/:userId
 * @desc    Update user
 * @access  Owner, Admin
 */
router.patch('/:userId', auth('manageUsers'), userValidation.updateUser, userController.updateUser);

/**
 * @route   DELETE api/users/:userId
 * @desc    Delete a user
 * @access  Owner, Admin
 */
router.delete('/:userId', auth('manageUsers'), userValidation.deleteUser, userController.deleteUser);

module.exports = router;
