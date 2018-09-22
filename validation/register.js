const validator = require('validator');
const _ = require('lodash');

// Data -> req.body object from register user request
module.exports = (data) => {
  let errors = {};

  // Validator accepts only string, so if some property of req.body are empty, set it to empty string
  data.name = _.isEmpty(data.name) ? '' : data.name;
  data.username = _.isEmpty(data.username) ? '' : data.username;
  data.email = _.isEmpty(data.email) ? '' : data.email;
  data.password = _.isEmpty(data.password) ? '' : data.password;
  data.password2 = _.isEmpty(data.password2) ? '' : data.password2;

  // Name validation
  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  // Username validation
  if (!validator.isLength(data.username, { min: 2, max: 15 })) {
    errors.username = 'Username must be between 2 and 15 characters';
  }
  if (!validator.isAlphanumeric(data.username)) {
    errors.username = 'Invalid username';
  }
  if (validator.isEmpty(data.username)) {
    errors.username = 'Username field is required';
  }

  // Email validation
  if (!validator.isEmail(data.email)) {
    errors.email = 'Invalid email';
  }
  if (validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  // Password validation
  if (!validator.isLength(data.password, { min: 2, max: 30})) {
    errors.password = 'Password must be between 2 and 30 characters';
  }
  if (validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }
  if (validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm password field is required';
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  }
};