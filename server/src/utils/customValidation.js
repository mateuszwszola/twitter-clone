const validator = require('validator');

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('{{#label}} must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

const username = (value, helpers) => {
  if (!value.match(/^[0-9a-zA-Z_.-]+$/)) {
    return helpers.message('username must only contain numbers, letters, ".", "-", "_"');
  }
  return value;
};

const url = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.message('{{#label}} must be a valid url');
  }
  return value;
};

module.exports = {
  objectId,
  password,
  username,
  url,
};
