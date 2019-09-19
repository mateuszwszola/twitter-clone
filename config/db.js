const mongoose = require('mongoose');
const { MONGO_URI, MONGO_TEST_URI } = require('./keys');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.NODE_ENV === 'test' ? MONGO_TEST_URI : MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
