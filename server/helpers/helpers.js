const { User } = require('../components/users');
const { Profile } = require('../components/users');
const { dummyUsers } = require('../fixtures/dummy_data');

exports.testNoTokenError = function (res) {
  res.should.have.status(401);
  res.body.should.be.a('object');
  res.body.should.have.property('errors');
  res.body.errors.should.be.a('array');
  res.body.errors[0].should.have.property(
    'msg',
    'No token, authorization denied'
  );
};

exports.createTwoUsersWithProfile = async function () {
  const userA = await new User(dummyUsers[0]).save();
  const profileA = await new Profile({ user: userA.id }).save();
  const userB = await new User(dummyUsers[1]).save();
  const profileB = await new Profile({ user: userB.id }).save();

  return { userA, profileA, userB, profileB };
};

exports.testPopulatedUserObject = function (body, user) {
  body.should.have.property('user');
  body.user.should.be.a('object');
  body.user.should.have.property('_id', user.id);
  body.user.should.have.property('name', user.name);
  body.user.should.have.property('username', user.username);
};
