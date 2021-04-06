const { NODE_ENV } = require('../config/keys');
const logger = require('./logger');

const isProd = NODE_ENV === 'production';

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleNotFound = (req, res, next) => {
  logger.info(`Route ${req.url} not found`);

  const error = new ErrorHandler(404, `Route ${req.originalUrl} Not Found`);
  next(error);
};

// eslint-disable-next-line
const handleError = (err, req, res, next) => {
  logger.error(err);

  if (res.headersSent) {
    next(err);
  } else {
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
