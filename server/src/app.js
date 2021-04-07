const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config/keys');
const routes = require('./routes');
const { handleNotFound, handleError } = require('./utils/error');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

if (config.env !== 'test') {
  app.use(morgan('dev'));
}

app.use(cors());

// Handle routes
app.use('/api', routes);

// 404 error handler
app.use(handleNotFound);

// Error handler
app.use(handleError);

module.exports = app;
