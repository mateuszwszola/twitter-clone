const mongoose = require('mongoose');
const _ = require('lodash');
const connectDB = require('../../src/config/db');

const remove = (collection) => {
  return new Promise((resolve, reject) => {
    collection
      .deleteMany()
      .then(resolve)
      .catch((err) => {
        return reject(err);
      });
  });
};

const setupTestDB = () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await Promise.all(_.map(mongoose.connection.collections, (c) => remove(c)));
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
