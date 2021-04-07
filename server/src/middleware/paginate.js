const { ErrorHandler } = require('../utils/error');

const paginate = (defaultPageSize = 100) => (req, _res, next) => {
  let { page, limit } = req.query;

  page = page ? parseInt(page) : 0;
  limit = limit ? parseInt(limit) : defaultPageSize;

  if (Number.isNaN(page) || Number.isNaN(limit) || page < 0 || limit < 1) {
    return next(new ErrorHandler(400, 'Invalid page query params'));
  }

  req.query.skip = page * limit;
  req.query.limit = limit;

  next();
};

module.exports = paginate;
