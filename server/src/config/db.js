/* eslint-disable security/detect-object-injection */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./keys');
const _ = require('lodash');

const connectDB = async () => {
  return mongoose.connect(config.mongoose.uri, config.mongoose.options);
};

const getCollectionDocuments = async (collection) => {
  return new Promise((resolve, reject) => {
    collection
      .find()
      .toArray()
      .then(resolve)
      .catch((err) => reject(err));
  });
};

const removeCollection = (collection) => {
  return new Promise((resolve, reject) => {
    collection
      .deleteMany()
      .then(resolve)
      .catch((err) => {
        return reject(err);
      });
  });
};

const removeCollections = async () => {
  await Promise.all(_.map(mongoose.connection.collections, (c) => removeCollection(c)));
};

const seedDB = async () => {
  await removeCollections();

  console.log('🌱 Inserting Seed Data');

  const seedData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'database-seed.json'), 'utf-8'));

  for (const collectionName in seedData) {
    const modelName = _.upperFirst(collectionName.slice(0, -1)); // users => User
    const model = mongoose.models[modelName];
    if (!model) {
      throw new Error(`Mongo model: "${modelName}" does not exists`);
    }

    await model.insertMany(seedData[collectionName]);
  }

  // const users = [userOne, userTwo, admin];

  // const profiles = users.map((user) => ({
  //   user: user._id,
  //   bio: faker.name.title(),
  //   location: faker.address.city() + ', ' + faker.address.country(),
  //   website: faker.internet.url(),
  //   birthday: faker.date.past(30),
  //   avatar: faker.image.avatar(),
  //   backgroundImage: faker.image.imageUrl(),
  // }));

  // const tweets = Array(20)
  //   .fill(null)
  //   .map((_, i) => ({
  //     author: users[Math.floor(Math.random() * 3)],
  //     text: faker.lorem.words(10),
  //     edited: Math.random() < 0.5,
  //     repliesCount: i < 10 ? 1 : 0,
  //   }));

  // const replies = Array(10)
  //   .fill(null)
  //   .map((_, i) => ({
  //     author: users[Math.floor(Math.random() * 3)],
  //     text: faker.lorem.words(10),
  //     replyTo: tweets[i]._id,
  //   }));

  // await insertUsers(users);
  // await Profile.insertMany(profiles);
  // await Tweet.insertMany(tweets);
  // await Tweet.insertMany(replies);

  console.log('✅ Seed Data Inserted');
};

module.exports = {
  connectDB,
  seedDB,
  removeCollections,
  getCollectionDocuments,
};
