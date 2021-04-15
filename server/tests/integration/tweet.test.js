const request = require('supertest');
const faker = require('faker');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, insertUsers } = require('../fixtures/user.fixture');
const { Tweet } = require('../../src/components/tweets');

setupTestDB();

describe('Tweets routes', () => {
  describe('GET /api/tweets', () => {
    it('When request is ok, should return tweets and apply default query options', async () => {
      const tweet = { author: userOne._id, text: faker.lorem.text(100) };
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
  });
});
