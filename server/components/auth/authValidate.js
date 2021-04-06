const { body } = require('express-validator');
const charLengthForProps = require('../../helpers/charLengthForProps');
const startCase = require('../../helpers/startCase');
const { User } = require('../users');
const { ErrorHandler } = require('../../utils/error');

module.exports.login = function login() {
  return [
    body('username', 'username is required').exists().trim().not().isEmpty(),
    body('password', 'password is required').exists().trim().not().isEmpty(),
  ];
};

module.exports.register = function register() {
  return [
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
          return Promise.reject('username already in use');
        }
      })
      .isLength(charLengthForProps.username)
      .withMessage(
        `The username must be between ${charLengthForProps.username.min} and ${charLengthForProps.username.max} chars`
      )
      .customSanitizer((value) => {
        return value.split(' ').join('');
      }),
    body('email', 'email is required')
      .exists()
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .withMessage('invalid email')
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
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
    body('password2', 'confirmation password is required')
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
};
