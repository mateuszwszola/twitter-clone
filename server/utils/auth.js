const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, JWT_EXPIRES } = require('../config/keys');

module.exports.generateAccessToken = function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: Number(JWT_EXPIRES),
  });
};

module.exports.hashPassword = async function hashPassword(password, salt = 10) {
  return await bcrypt.hash(password, salt);
};
