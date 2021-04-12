const Joi = require('joi');
const { objectId, url } = require('../../utils/customValidation');

const getProfiles = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProfile = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const updateProfile = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      bio: Joi.string().max(255),
      location: Joi.string().max(255),
      website: Joi.string().custom(url).max(255),
      birthday: Joi.date(),
      avatar: Joi.string().custom(url),
      backgroundImage: Joi.string().custom(url),
    })
    .min(1),
};

module.exports = {
  getProfiles,
  getProfile,
  updateProfile,
};
