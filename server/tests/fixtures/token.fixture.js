const { generateAccessToken } = require('../../src/utils/auth');
const { userOne, userTwo, admin } = require('./user.fixture');

const getUserOneAccessToken = () =>
  generateAccessToken({
    user: {
      id: userOne._id,
      role: userOne.role,
    },
  });

const getUserTwoAccessToken = () =>
  generateAccessToken({
    user: {
      id: userTwo._id,
      role: userTwo.role,
    },
  });

const getAdminAccessToken = () =>
  generateAccessToken({
    user: {
      id: admin._id,
      role: admin.role,
    },
  });

module.exports = {
  getUserOneAccessToken,
  getUserTwoAccessToken,
  getAdminAccessToken,
};
