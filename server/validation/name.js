const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = (name) => {
  name = isEmpty(name) ? '' : name;
  const nameErrors = {};

  name = name.trim();
  if (!validator.isLength(name, { min: 6, max: 30 })) {
    nameErrors.name = 'Name must be between 6 and 30 characters';
  }
  if (!validator.isAlphanumeric(name.split(' ').join(''))) {
    nameErrors.name = 'Invalid name';
  }
  if (validator.isEmpty(name)) {
    nameErrors.name = 'Name field is required';
  }

  return {
    nameErrors,
    isNameValid: isEmpty(nameErrors),
  };
};
