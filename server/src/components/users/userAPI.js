const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const userController = require('./userController');
const {
  update: updateValidationRules,
  create: createValidationRules,
} = require('./usersValidation');

/**
 * @route   GET api/users
 * @desc    Get all users
 * @access  Admin
 */
router.get('/', authenticate, authorize('admin'), userController.getUsers);

/**
 * @route   GET api/users/:userId
 * @desc    Get user by id
 * @access  User, Admin
 */
router.get('/:userId', authenticate, userController.getUserById);

/**
 * @route   POST api/users
 * @desc    Create user
 * @access  Admin
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createValidationRules),
  userController.createUser
);

/**
 * @route   PATCH api/users/:userId
 * @desc    Update user
 * @access  User, Admin
 */
router.patch(
  '/:userId',
  authenticate,
  validate(updateValidationRules),
  userController.updateUser
);

/**
 * @route   DELETE api/users/:userId
 * @desc    Delete a user
 * @access  Admin
 */
router.delete(
  '/:userId',
  authenticate,
  authorize('admin'),
  userController.deleteUser
);

module.exports = router;
