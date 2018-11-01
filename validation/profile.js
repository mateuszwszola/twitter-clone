// Validation for creating or updating user PROFILE
const validator = require('validator');
const _ = require('lodash');

module.exports = data => {
  let errors = {};

  // I don't know exactly what req.body will contain. Sometimes it will be full information about profile, and sometimes just some properties to update so I need to loop through every property in req.body object, make sure it is a string, and then validate it

  const profileInformation = [
    'bio',
    'location',
    'website',
    'birthday',
    'avatar',
    'backgroundPicture',
    'name' // This is an extra property which is placed in User model (but I would like to be able to change it with profile)
  ];

  const lengthForProps = {
    bio: { min: 2, max: 50 },
    location: { min: 2, max: 30 },
    website: { min: 3, max: 30 },
    name: { min: 2, max: 30 }
  };

  const entries = Object.entries(data);
  console.log('entries', entries);
  entries.forEach(([property, value]) => {
    value = value.trim();
    value = _.isEmpty(value) ? '' : value.toString();

    // I do not specify isEmpty for things like bio, because user can fill empty bio to reset bio
    // If req.body has a value, and the value is not empty, user do not want to clear the input, so I validate it

    if (profileInformation.includes(property)) {
      if (!_.isEmpty(value)) {
        if (!validator.isLength(value, lengthForProps[property])) {
          errors[property] = `${property} must be between ${
            lengthForProps[property].min
          } and ${lengthForProps[property].max}`;
        }
      }
    }

    if (property === 'name') {
      if (_.isEmpty(value)) {
        errors.name = 'You need to specify a value for name field';
      } else {
        if (!validator.isAlphanumeric(value.split(' ').join(''), 'pl-PL')) {
          errors.name = 'Invalid name format';
        }
      }
    }

    if (property === 'location') {
      if (!_.isEmpty(value)) {
        if (!validator.isAlphanumeric(value.split(' ').join(''))) {
          errors.location = 'Invalid location';
        }
      }
    }

    if (property === 'website') {
      if (!_.isEmpty(value)) {
        if (!validator.isURL(value)) {
          errors.website = 'Website must be a URL';
        }
      }
    }

    if (property === 'birthday') {
      if (!_.isEmpty(value)) {
        if (!_.isDate(value)) {
          errors.birthday = 'Birthday must be a date';
        }
      }
    }
    // TODO:
    // if (property === 'avatar') {
    //   // Avatar will be uploaded by the user

    // }

    // if (property === 'backgroundPicture') {
    //   // Background Picuture will be uploaded by the user
    // }
  });

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};
