const Joi = require('joi');
const { roles } = require('../../config/roles');
const { objectId, password, username, url } = require('../../utils/customValidation');
const validate = require('../../middleware/validate');

/* 
  Defining validation as middleware functions gives access to
  information from request and response objects, allowing to change the schema
  based on criteria for example: if a user is an admin, it can also update the user role
*/

const getUsers = (req, res, next) => {
  const schema = {
    query: Joi.object().keys({
      name: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
  };

  validate(schema)(req, res, next);
};

const getUser = (req, res, next) => {
  const schema = {
    params: Joi.object().keys({
      userId: Joi.string().required().custom(objectId),
    }),
  };

  validate(schema)(req, res, next);
};

const createUser = (req, res, next) => {
  const schema = {
    body: Joi.object().keys({
      name: Joi.string().required(),
      username: Joi.string().required().min(3).max(30).custom(username),
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      role: Joi.string()
        .required()
        .valid(...roles),
      avatar: Joi.string().custom(url).max(255),
    }),
  };

  validate(schema)(req, res, next);
};

const updateUser = (req, res, next) => {
  const schemaRules = {
    params: {
      userId: Joi.required().custom(objectId),
    },
    body: {
      name: Joi.string(),
      username: Joi.string().min(3).max(30).custom(username),
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      avatar: Joi.string().custom(url).max(255).allow(''),
    },
  };

  // Admin can also update user role
  if (req.user.role === 'admin') {
    schemaRules.body.role = Joi.string().valid(...roles);
  }

  validate(schemaRules)(req, res, next);
};

const deleteUser = (req, res, next) => {
  const schema = {
    params: Joi.object().keys({
      userId: Joi.string().required().custom(objectId),
    }),
  };

  validate(schema)(req, res, next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
