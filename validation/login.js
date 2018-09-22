const validator = require('validator');
const _ = require('lodash');

module.exports = (data) => {
  let errors = {};

  data.username = _.isEmpty(data.username) ? '' : data.username;
  data.password = _.isEmpty(data.password) ? '' : data.password;

  if (validator.isEmpty(data.username)) {
    errors.username = 'Username field is required';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  }
}