const config = require('../config/keys');
const logger = require('./logger');

const isProd = config.env === 'production';

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleNotFound = (req, _res, next) => {
  const error = new ErrorHandler(404, `Route ${req.originalUrl} Not Found`);
  next(error);
};

// eslint-disable-next-line
const handleError = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  } else {
    if (config.env !== 'test') {
      logger.error(err);
    }
    res.status(err.statusCode || 500);
    res.json({
      message: err.message || 'Internal Server Error',
      ...(isProd ? null : { stack: err.stack }),
    });
  }
};

module.exports = {
  ErrorHandler,
  handleError,
  handleNotFound,
};
