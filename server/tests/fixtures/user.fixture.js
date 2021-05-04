const mongoose = require('mongoose');
const faker = require('faker');
const { User } = require('../../src/components/users');
const { hashPassword } = require('../../src/utils/auth');
const { formatUsername } = require('../../src/utils/helpers');

const password = 'password123';

const userOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  username: faker.internet.userName(),
  password,
  role: 'user',
  avatar: faker.image.avatar(),
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  username: faker.internet.userName(),
  password,
  role: 'user',
  avatar: faker.image.avatar(),
};

const admin = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  username: faker.internet.userName(),
  password,
  role: 'admin',
  avatar: faker.image.avatar(),
};

const insertUsers = async (users) => {
  const hashedPassword = await hashPassword(password);
  return await User.insertMany(
    users.map((user) => ({ ...user, username: formatUsername(user.username), password: hashedPassword }))
  );
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
