const { generateAccessToken } = require('../../src/utils/auth');
const { userOne, userTwo, admin } = require('./user.fixture');

const getUserOneAccessToken = () => generateAccessToken(userOne._id);

const getUserTwoAccessToken = () => generateAccessToken(userTwo._id);

const getAdminAccessToken = () => generateAccessToken(admin._id);

module.exports = {
  getUserOneAccessToken,
  getUserTwoAccessToken,
  getAdminAccessToken,
};
