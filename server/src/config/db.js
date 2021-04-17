const mongoose = require('mongoose');
const config = require('./keys');

const connectDB = async () => {
  return mongoose.connect(config.mongoose.uri, config.mongoose.options);
};

module.exports = connectDB;
