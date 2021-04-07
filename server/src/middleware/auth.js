const { verifyToken } = require('../utils/auth');
const { ErrorHandler } = require('../utils/error');

const authenticate = async (req, _res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];

  if (authHeader) {
    // Bearer token -> token
    const token = authHeader.split(' ')[1];

    try {
      const { user } = await verifyToken(token);
      req.user = user;
      next();
    } catch (err) {
      throw new ErrorHandler(403, 'You are not authorized');
    }
  } else {
    throw new ErrorHandler(401, 'No authorization token provided');
  }
};

const authorize = (...permittedRoles) => (req, _res, next) => {
  const { user } = req;

  if (user && permittedRoles.includes(user.role)) {
    next();
  } else {
    throw new ErrorHandler(403, 'Forbidden');
  }
};

module.exports = {
  authenticate,
  authorize,
};
