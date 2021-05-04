const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/keys');

const generateAccessToken = (userId) => {
  const payload = {
    sub: userId,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: Number(config.jwt.expires || 3600),
  });
};

const hashPassword = async (password, salt = 10) => {
  return await bcrypt.hash(password, salt);
};

const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

module.exports = {
  generateAccessToken,
  hashPassword,
  verifyToken,
};
