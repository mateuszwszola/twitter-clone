const { body } = require('express-validator');
const charLengthForProps = require('../../helpers/charLengthForProps');
const { formatUsername } = require('../../utils/helpers');
const { User } = require('../users');

const login = () => [
  body('username', 'username is required').exists().trim().not().isEmpty(),
  body('password', 'password is required').exists().trim().not().isEmpty(),
];

const register = () => [
  body('name', 'name is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .isLength(charLengthForProps.name)
    .withMessage(
      `The name must be between ${charLengthForProps.name.min} and ${charLengthForProps.name.max} chars`
    ),
  body('username', 'username is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .customSanitizer((value) => formatUsername(value))
    .custom(async (username) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('username already in use');
      }
    })
    .isLength(charLengthForProps.username)
    .withMessage(
      `The username must be between ${charLengthForProps.username.min} and ${charLengthForProps.username.max} chars`
    ),
  body('email', 'email is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('invalid email')
    .customSanitizer((value) => value.toLowerCase())
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('e-mail already in use');
      }
    }),
  body('password', 'password is required')
    .exists()
    .not()
    .isEmpty()
    .isLength(charLengthForProps.password)
    .withMessage(
      `The password must be between ${charLengthForProps.password.min} and ${charLengthForProps.password.max} chars`
    ),
  body('repeat_password', 'confirmation password is required')
    .exists()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('password confirmation does not match password');
      }

      return true;
    }),
];

module.exports = {
  login,
  register,
};
