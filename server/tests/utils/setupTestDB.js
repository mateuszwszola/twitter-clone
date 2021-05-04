const mongoose = require('mongoose');
const { connectDB, removeCollections } = require('../../src/config/db');

const setupTestDB = () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await removeCollections();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
