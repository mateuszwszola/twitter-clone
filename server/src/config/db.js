const mongoose = require('mongoose');
const config = require('./keys');

const connectDB = async () => {
  let dbUri = '';
  if (config.env === 'production') {
    dbUri = config.mongoose.prodUri;
  } else if (config.env === 'test') {
    dbUri = config.mongoose.testUri;
  } else {
    dbUri = config.mongoose.devUri;
  }

  return mongoose.connect(dbUri, config.mongoose.options);
};

module.exports = connectDB;
