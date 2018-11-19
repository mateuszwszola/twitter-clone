const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/config');
// const rateLimit = require('express-rate-limit');

const { mongoURI } = require('./config/keys');

const apiRoutes = require('./routes/api');

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

// MongoDB setup
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', console.log.bind(console, 'MongoDB connected!'));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Handle routes
app.use('/api', apiRoutes);

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
