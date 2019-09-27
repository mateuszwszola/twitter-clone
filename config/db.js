const mongoose = require('mongoose');
const debug = require('debug')('db');
const { MONGO_URI, MONGO_TEST_URI, MONGO_URI_PROD } = require('./keys');

const mongo_uri = process.env.NODE_ENV === 'production' ? MONGO_URI_PROD : MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.NODE_ENV === 'test' ? MONGO_TEST_URI : mongo_uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    debug('MongoDB connected...');
  } catch (err) {
    debug(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
