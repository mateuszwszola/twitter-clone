const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { comments, profiles, tweets, users } = require('./components');
const { handleNotFound, handleError } = require('./utils/error');

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
  app.use(morgan('dev'));
}

// Handle routes
app.use('/api/comments', comments);
app.use('/api/profiles', profiles);
app.use('/api/tweets', tweets);
app.use('/api/users', users);

// 404 error handler
app.use(handleNotFound);

// Error handler
app.use(handleError);

module.exports = app;
