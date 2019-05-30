const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
require('./config');
const connectDB = require('./config/db');
// const rateLimit = require('express-rate-limit');

// Express app setup
const app = express();

// Connect to the DB
connectDB();

// Handle static assets placed in public directory
app.use(express.static(path.join(__dirname, './public')));
app.use(logger('dev'));
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// cookie parser
app.use(cookieParser());

// Handle routes
app.use('/api', require('./routes/api'));

// Handle 404 errors
app.use((req, res, next) => {
  next(createError(404, 'Not Found'));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app;
