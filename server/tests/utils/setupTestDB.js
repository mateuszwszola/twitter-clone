const mongoose = require('mongoose');
const config = require('../../src/config/keys');

const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongoose.testUri, config.mongoose.options);
  });

  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async (collection) =>
        collection.deleteMany()
      )
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
