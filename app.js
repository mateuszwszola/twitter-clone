const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const createError = require('http-errors');
const routes = require('./routes/api');

// use dotenv
dotenv.config({
  silent: true,
});

// Express app setup
const app = express();

// Handle static assets placed in public directory
app.use(express.static(path.join(__dirname, './public')));
app.use(logger('dev'));
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// cookie parser
app.use(cookieParser());

// Handle routes
app.use('/', routes);

// Handle 404 errors
app.use((req, res, next) => {
  next(createError(404, 'Not Found'));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {},
  });
  next();
});

module.exports = app;