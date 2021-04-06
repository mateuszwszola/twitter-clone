require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI_DEV: process.env.MONGO_URI,
  MONGO_URI_PROD: process.env.MONGO_URI_PROD,
  MONGO_TEST_URI: process.env.MONGO_TEST_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
};
