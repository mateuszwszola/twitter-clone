const router = require('express').Router();
const auth = require('../../middleware/auth');
const userController = require('./userController');

/*
  @route   GET api/users
  @desc    Get all the users
  @access  Public
 */
router.get('/', userController.getAllUsers);

/*
  @route   GET api/users/current
  @desc    Return current user
  @access  Private
 */
router.get('/current', auth, userController.getCurrentUser);

/*
  @route   GET api/users/:user_id
  @desc    Get user by ID
  @access  Public
 */
router.get('/:user_id', userController.getUserById);

/*
  @route   POST api/users/register
  @desc    Register new user | Returning JWT
  @access  Public
 */
router.post(
  '/register',
  userController.validate('registerUser'),
  userController.registerUser
);

/*
  @route   POST api/users/login
  @desc    Login user | Returning JWT
  @access  Public
 */
router.post(
  '/login',
  userController.validate('loginUser'),
  userController.loginUser
);

module.exports = router;
