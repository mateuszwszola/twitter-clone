const request = require('supertest');
const faker = require('faker');
const mongoose = require('mongoose');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, insertUsers, userTwo } = require('../fixtures/user.fixture');
const { Tweet } = require('../../src/components/tweets');

setupTestDB();

describe('Tweets routes', () => {
  describe('GET /api/tweets', () => {
    describe('Returns tweets based on different options and filters', () => {
      it('When request is ok, should return tweets with populated author data and apply default query options', async () => {
        const tweet = { author: userOne._id, text: faker.lorem.words(10) };
        await Promise.all([insertUsers([userOne]), Tweet.create(tweet)]);

        const res = await request(app).get('/api/tweets');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: expect.any(Array),
          page: 1,
          limit: 10,
          totalPages: 1,
          totalResults: 1,
        });
        expect(res.body.results).toHaveLength(1);
        const [resTweet] = res.body.results;
        expect(resTweet.text).toBe(tweet.text);
        expect(resTweet.author._id).toBe(tweet.author.toString());
        expect(resTweet.author).toHaveProperty('name');
        expect(resTweet.author).toHaveProperty('username');
      });

      it('When limit param is specified, should limit returned tweets', async () => {
        const tweets = [
          { author: userOne._id, text: faker.lorem.words(10) },
          { author: userOne._id, text: faker.lorem.words(10) },
        ];
        await Promise.all([insertUsers([userOne]), Tweet.insertMany(tweets)]);

        const res = await request(app)
          .get('/api/tweets')
          .query({ limit: 1 })
          .expect(200);

        expect(res.body).toEqual({
          results: expect.any(Array),
          page: 1,
          limit: 1,
          totalPages: 2,
          totalResults: 2,
        });
        expect(res.body.results).toHaveLength(1);
      });

      it('When limit and page params are specified, should return correct page with tweets', async () => {
        const tweets = [
          { author: userOne._id, text: faker.lorem.words(10) },
          { author: userOne._id, text: faker.lorem.words(10) },
        ];
        await Promise.all([insertUsers([userOne]), Tweet.insertMany(tweets)]);

        const res = await request(app)
          .get('/api/tweets')
          .query({ limit: 1, page: 2 })
          .expect(200);

        expect(res.body).toEqual({
          results: expect.any(Array),
          page: 2,
          limit: 1,
          totalPages: 2,
          totalResults: 2,
        });
        expect(res.body.results).toHaveLength(1);
      });

      it('When likes param is specified, should return tweets liked by a user', async () => {
        const tweets = [
          {
            author: userOne._id,
            text: faker.lorem.words(10),
            likes: [userTwo._id],
          },
          { author: userOne._id, text: faker.lorem.words(10) },
        ];
        await Promise.all([
          insertUsers([userOne, userTwo]),
          Tweet.insertMany(tweets),
        ]);

        const res = await request(app)
          .get('/api/tweets')
          .query({ likes: userTwo._id.toString() })
          .expect(200);

        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0]).toHaveProperty('likes', [
          userTwo._id.toString(),
        ]);
      });

      it('When retweets param is specified, should return tweets retweeted by a user', async () => {
        const tweets = [
          {
            author: userOne._id,
            text: faker.lorem.words(10),
            retweets: [userTwo._id],
          },
          { author: userOne._id, text: faker.lorem.words(10) },
        ];
        await Promise.all([
          insertUsers([userOne, userTwo]),
          Tweet.insertMany(tweets),
        ]);

        const res = await request(app)
          .get('/api/tweets')
          .query({ retweets: userTwo._id.toString() })
          .expect(200);

        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0]).toHaveProperty('retweets', [
          userTwo._id.toString(),
        ]);
      });

      it('When replyTo param is specified, should return top level tweet replies', async () => {
        const tweetId = mongoose.Types.ObjectId();
        const tweets = [
          {
            _id: tweetId,
            author: userOne._id,
            text: faker.lorem.words(10),
          },
          {
            author: userTwo._id,
            text: faker.lorem.words(10),
            replyTo: tweetId,
          },
        ];
        await Promise.all([
          insertUsers([userOne, userTwo]),
          Tweet.insertMany(tweets),
        ]);

        const res = await request(app)
          .get('/api/tweets')
          .query({ replyTo: tweetId.toString() })
          .expect(200);

        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0]).toHaveProperty(
          'replyTo',
          tweetId.toString()
        );
      });
    });

    describe('Returns 400 error if invalid mongo id provided', () => {
      it('When likes param is invalid mongo id, should return 400 error', async () => {
        const res = await request(app)
          .get('/api/tweets')
          .query({ likes: 'invalidId' });

        expect(res.statusCode).toBe(400);
      });

      it('When retweets param is invalid mongo id, should return 400 error', async () => {
        const res = await request(app)
          .get('/api/tweets')
          .query({ retweets: 'invalidId' });

        expect(res.statusCode).toBe(400);
      });

      it('When replyTo param is invalid mongo id, should return 400 error', async () => {
        const res = await request(app)
          .get('/api/tweets')
          .query({ replyTo: 'invalidId' });

        expect(res.statusCode).toBe(400);
      });
    });

    describe('Returns 404 error if resource with provided id does not exists', () => {
      it('When likes param is specified and user does not exists, should return 404 error', async () => {
        const res = await request(app)
          .get('/api/tweets')
          .query({ likes: userOne._id.toString() });

        expect(res.statusCode).toBe(404);
      });

      it('When retweets param is specified and user does not exists, should return 404 error', async () => {
        const res = await request(app)
          .get('/api/tweets')
          .query({ retweets: userOne._id.toString() });

        expect(res.statusCode).toBe(404);
      });

      it('When replyTo param is specified and tweet does not exists, should return 404 error', async () => {
        const tweetId = mongoose.Types.ObjectId();

        const res = await request(app)
          .get('/api/tweets')
          .query({ replyTo: tweetId.toString() });

        expect(res.statusCode).toBe(404);
      });
    });
  });
});
