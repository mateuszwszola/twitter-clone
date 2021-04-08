const { body, checkSchema } = require('express-validator');
const charLengthForProps = require('../../helpers/charLengthForProps');
const { User } = require('./');
const { formatUsername } = require('../../utils/helpers');
const { roles } = require('../../config/roles');

const update = () => {
  return [
    body('name')
      .optional({ checkFalsy: true })
      .isLength(charLengthForProps.name)
      .withMessage(
        `The name must be between ${charLengthForProps.name.min} and ${charLengthForProps.name.max} chars`
      ),
    body('username')
      .optional({ checkFalsy: true })
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
  ];
};

const create = () => {
  const roleSchema = {
    role: {
      in: 'body',
      errorMessage: 'Invalid user role',
      isIn: {
        options: [roles],
      },
    },
  };

  return [
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
    checkSchema(roleSchema),
  ];
};

module.exports = {
  update,
  create,
};
