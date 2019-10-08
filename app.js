const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
require('./config');
const connectDB = require('./config/db');

// Express app setup
const app = express();

// Connect to the DB
connectDB();

app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
}
// const global_socket = require('./io').io();

// Handle routes
app.use('/api', require('./routes'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static assets
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  return res.status(404).json({ errors: [{ msg: `Route ${req.url} Not Found` }]})
});

// 500 - Any server error handler
app.use((err, req, res) => {
  return res.status(500).json({ errors: [{ msg: err.message || 'Internal Server Error' }]});
});

module.exports = app;
