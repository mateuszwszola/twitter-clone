const Joi = require('joi');
const { password } = require('../../utils/customValidation');

const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    username: Joi.string().required().min(3).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  login,
  register,
};
