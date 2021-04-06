const mongoose = require('mongoose');
const { NODE_ENV } = require('./keys');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    let dbUri = '';
    if (NODE_ENV === 'production') {
      dbUri = process.env.MONGO_URI_PROD;
    } else if (NODE_ENV === 'test') {
      dbUri = process.env.MONGO_URI_TEST;
    } else {
      dbUri = process.env.MONGO_URI_DEV;
    }

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    logger.info('MongoDB connected...');
  } catch (err) {
    logger.error(err);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
