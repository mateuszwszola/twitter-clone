const Joi = require('joi');
const { objectId } = require('../../utils/customValidation');

const getTweets = {
  query: Joi.object().keys({
    likes: Joi.string().custom(objectId),
    retweets: Joi.string().custom(objectId),
    replyTo: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTweet = {
  params: Joi.object().keys({
    tweetId: Joi.string().required().custom(objectId),
  }),
};

const createTweet = {
  body: Joi.object().keys({
    text: Joi.string().required().min(1).max(280),
    replyTo: Joi.string().custom(objectId),
  }),
};

const updateTweet = {
  params: getTweet.params,
  body: Joi.object().keys({
    text: Joi.string().required().min(1).max(280),
  }),
};

const deleteTweet = {
  params: getTweet.params,
};

module.exports = {
  getTweets,
  getTweet,
  createTweet,
  updateTweet,
  deleteTweet,
};
