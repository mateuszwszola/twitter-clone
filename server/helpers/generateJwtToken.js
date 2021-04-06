const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

module.exports = async function (user_id, expiresIn = 3600) {
  const payload = {
    user: {
      id: user_id,
    },
  };

  return await jwt.sign(payload, JWT_SECRET, { expiresIn });
};
