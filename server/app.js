const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const logger = require('morgan');
const connectDB = require('./config/db');
const { comments, profiles, tweets, users } = require('./components');

// Express app setup
const app = express();

// Connect to the DB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

// Handle routes
app.use('/api/comments', comments);
app.use('/api/profiles', profiles);
app.use('/api/tweets', tweets);
app.use('/api/users', users);

// 404 handler
app.use((req, res, next) => {
  return res
    .status(404)
    .json({ errors: [{ msg: `Route ${req.url} Not Found` }] });
});

// 500 - Any server error handler
app.use((err, req, res, next) => {
  return res
    .status(500)
    .json({ errors: [{ msg: err.message || 'Internal Server Error' }] });
});

module.exports = app;
