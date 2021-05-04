const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const config = require('./config/keys');
const { jwtStrategy } = require('./config/passport');
const { getRoutes } = require('./routes');
const testDataRoutes = require('./routes/testDataRoutes');
const { handleNotFound, handleError } = require('./utils/error');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(compression());

if (config.env !== 'test') {
  app.use(morgan('dev'));
}

app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Handle routes
app.use('/api', getRoutes());

if (config.env === 'development' || config.env === 'test') {
  app.use('/testData', testDataRoutes);
}

// 404 error handler
app.use(handleNotFound);

// Error handler
app.use(handleError);

module.exports = app;
