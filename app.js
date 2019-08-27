const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('./config');
const connectDB = require('./config/db');
// const rateLimit = require('express-rate-limit');

// Express app setup
const app = express();

// Connect to the DB
connectDB();

// Handle static assets placed in public directory
app.use(express.static(path.join(__dirname, './public')));
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// cookie parser
app.use(cookieParser());

// Handle routes
app.use('/api', require('./routes'));

// 404 handler
app.use((req, res) => {
  return res.status(404).json({ errors: [{ msg: `Route ${req.url} Not Found` }]})
});

// 500 - Any server error handler
app.use((err, req, res) => {
  return res.status(500).json({ errors: [{ msg: err.message || 'Internal Server Error' }]});
});

module.exports = app;
