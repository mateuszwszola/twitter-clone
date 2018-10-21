const validator = require('validator');
const _ = require('lodash');

module.exports = (name, nameErrors) => {
  name = _.isEmpty(name) ? '' : name;

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
    isNameValid: _.isEmpty(nameErrors)
  };
};
