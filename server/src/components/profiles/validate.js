const { body } = require('express-validator');
const Filter = require('bad-words');
const charLengthForProps = require('../../helpers/charLengthForProps');
const validateBirthday = require('../../validation/birthday');

const filter = new Filter();

exports.validateProfile = function validateProfile() {
  return [
    body('bio')
      .optional({ checkFalsy: true })
      .trim()
      .isLength(charLengthForProps.bio)
      .withMessage(
        `The bio must be between ${charLengthForProps.bio.min} and ${charLengthForProps.bio.max} chars long`
      )
      .escape()
      .customSanitizer((value) => {
        return filter.clean(value);
      }),
    body('location')
      .optional({ checkFalsy: true })
      .trim()
      .isLength(charLengthForProps.location)
      .withMessage(
        `The location must be between ${charLengthForProps.location.min} and ${charLengthForProps.location.max} chars long`
      ),
    body('website')
      .optional({ checkFalsy: true })
      .trim()
      .isLength(charLengthForProps.website)
      .withMessage(
        `The website must be between ${charLengthForProps.website.min} and ${charLengthForProps.website.max} chars long`
      )
      .isURL()
      .withMessage('Website must be a valid URL'),
    body('birthday', 'Birthday must be a valid date')
      .optional({ checkFalsy: true })
      .custom(validateBirthday),
    body('avatar', 'Avatar must be a URL')
      .optional({ checkFalsy: true })
      .isURL(),
    body('backgroundPicture', 'Background picture must be a URL')
      .optional({ checkFalsy: true })
      .isURL(),
  ];
};
