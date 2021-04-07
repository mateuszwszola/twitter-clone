const { body } = require('express-validator');
const { startCase } = require('lodash');
const charLengthForProps = require('../../helpers/charLengthForProps');
const { User } = require('../users');
const { ErrorHandler } = require('../../utils/error');

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
    )
    .customSanitizer(startCase),
  body('username', 'username is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .custom(async (value) => {
      const username = value.split(' ').join('');

      const user = await User.findOne({ username });
      if (user) {
        throw new ErrorHandler(400, 'username already in use');
      }
    })
    .isLength(charLengthForProps.username)
    .withMessage(
      `The username must be between ${charLengthForProps.username.min} and ${charLengthForProps.username.max} chars`
    )
    .customSanitizer((value) => value.split(' ').join('')),
  body('email', 'email is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('invalid email')
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        return Promise.reject('e-mail already in use');
      }
    })
    .normalizeEmail(),
  body('password', 'password is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .isLength(charLengthForProps.password)
    .withMessage(
      `The password must be between ${charLengthForProps.password.min} and ${charLengthForProps.password.max} chars`
    ),
  body('repeat_password', 'confirmation password is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new ErrorHandler(
          400,
          'password confirmation does not match password'
        );
      }

      return true;
    }),
];

module.exports = {
  login,
  register,
};
