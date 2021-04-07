const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const userController = require('./userController');

/**
 * @route   GET api/users
 * @desc    Return authenticated user
 * @access  Private
 */
router.get('/', authenticate, userController.getUser);

/**
 * @route   GET api/users/all
 * @desc    Return all users
 * @access  Private
 */
router.get(
  '/all',
  authenticate,
  authorize('admin'),
  userController.getAllUsers
);

/**
 * @route   GET api/users/:userId
 * @desc    Get user by id
 * @access  Private
 */
router.get(
  '/:userId',
  authenticate,
  authorize('admin'),
  userController.getUserById
);

module.exports = router;
