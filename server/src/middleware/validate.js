const Joi = require('joi');
const { pick } = require('lodash');
const { ErrorHandler } = require('../utils/error');

const validate = (schema) => (req, _res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ErrorHandler(400, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
