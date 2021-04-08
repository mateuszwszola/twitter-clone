const mongoose = require('mongoose');
const faker = require('faker');
const { User } = require('../../src/components/users');
const { formatUsername } = require('../../src/utils/helpers');
const { hashPassword } = require('../../src/utils/auth');

const password = 'password123';

const userOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  username: formatUsername(faker.internet.userName()),
  password,
  role: 'user',
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  username: formatUsername(faker.internet.userName()),
  password,
  role: 'user',
};

const admin = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  username: formatUsername(faker.internet.userName()),
  password,
  role: 'admin',
};

const insertUsers = async (users) => {
  const hashedPassword = await hashPassword(password);
  return await User.insertMany(
    users.map((user) => ({ ...user, password: hashedPassword }))
  );
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};