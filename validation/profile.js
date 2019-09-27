// Validation for creating or updating user PROFILE
const validator = require('validator');
const { isEmpty, isDate } = require('lodash');

module.exports = data => {
  const errors = {};

  const profileInformation = [
    'bio',
    'location',
    'website',
    'birthday',
    'avatar',
    'backgroundPicture',
    'name',
    'username'
  ];

  const lengthForProps = {
    bio: { min: 2, max: 70 },
    location: { min: 2, max: 30 },
    website: { min: 3, max: 30 },
    name: { min: 2, max: 30 },
    username: { min: 6, max: 15 }
  };

  const entries = Object.entries(data);
  console.log('entries', entries);
  entries.forEach(([property, value]) => {
    value = value.trim();
    value = isEmpty(value) ? '' : value.toString();

    // I do not specify isEmpty for things like bio, because user can fill empty bio to reset bio
    // If req.body has a value, and the value is not empty, user do not want to clear the input, so I validate it

    if (profileInformation.includes(property)) {
      if (
        !isEmpty(value) &&
        lengthForProps[property] &&
        !validator.isLength(value, lengthForProps[property])
      ) {
        errors[property] = `${property} must be between ${
          lengthForProps[property].min
        } and ${lengthForProps[property].max}`;
      }
    }

    if (property === 'name' || property === 'username') {
      if (isEmpty(value)) {
        errors[property] = `You need to specify a value for ${property} field`;
      } else {
        if (!validator.isAlphanumeric(value.split(' ').join(''), 'pl-PL')) {
          errors[property] = `Invalid ${property} format`;
        }
      }
    }

    if (!isEmpty(value)) {
      if (
        property === 'location' &&
        !validator.isAlphanumeric(value.split(' ').join(''))
      ) {
        errors.location = 'Invalid location';
      }

      if (property === 'website' && !validator.isURL(value)) {
        errors.website = 'Website must be a URL';
      }

      if (property === 'birthday') {
        const birthdayDate = validator.toDate(value);
        if (!isDate(birthdayDate)) {
          errors.birthday = 'Birthday must be a valid date';
        }
        const prependWithZero = value => value < 10 ? '0' + value : value;
        const date = new Date();
        const year = date.getFullYear();
        const month = prependWithZero(date.getMonth() + 1);
        const day = prependWithZero(date.getDate());
        const minDate = `${year - 13}-${month}-${day}`;
        if (validator.isAfter(value, minDate)) {
          errors.birthday = 'You must be at least 13 years old';
        }
      }

      if (property === 'avatar' && !validator.isURL(value)) {
        errors.avatar = 'Avatar must be a URL';
      }

      if (property === 'backgroundPicture' && !validator.isURL(value)) {
        errors.backgroundPicture = 'Background picture must be a URL';
      }
    }
  });

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
