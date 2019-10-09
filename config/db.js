const mongoose = require('mongoose');
const debug = require('debug')('db');
const environment = process.env.NODE_ENV || 'development';

const connectDB = async () => {
  try {
    let dbUri = '';
    if (environment === 'production') {
      dbUri = process.env.MONGO_URI_PROD;
    } else if (environment === 'test') {
      dbUri = process.env.MONGO_URI_TEST;
    } else {
      dbUri = process.env.MONGO_URI_DEV;
    }
    
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    debug('MongoDB connected...');
  } catch (err) {
    debug(err.message);
    console.log(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
