const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = data => {
  const errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';
  data.media = !isEmpty(data.media) ? data.media : '';

  if (!validator.isLength(data.text, { min: 2, max: 140 })) {
    errors.text = 'Text fields must be between 2 and 140 characters';
  }
  if (validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }
  if (!validator.isEmpty(data.media) && !validator.isURL(data.media)) {
    errors.media = 'Not a valid media url';
  }

  return {
    isValid: isEmpty(errors),
    errors
  };
};
