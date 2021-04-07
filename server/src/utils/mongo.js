const mongoose = require('mongoose');

module.exports.generateMongoObjectId = function generateMongoObjectId() {
  return mongoose.Types.ObjectId();
};
