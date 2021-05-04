const request = require('supertest');
const faker = require('faker');
const mongoose = require('mongoose');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { getUserOneAccessToken, getAdminAccessToken } = require('../fixtures/token.fixture');
const { Tweet } = require('../../src/components/tweets');
const Profile = require('../../src/components/profiles/profile.model');

setupTestDB();

describe('Tweets routes', () => {
  describe('GET /api/tweets/feed', () => {
    it("When request is ok, should return user feed's tweets -> Combination of user's tweets and tweets from profiles user is following", async () => {
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([
          { user: userOne._id, following: [userTwo._id] },
          { user: userTwo._id, followers: [userOne._id] },
        ]),
        Tweet.insertMany([
          {
            author: userOne._id,
            text: faker.random.words(10),
          },
          {
            author: userTwo._id,
            text: faker.random.words(10),
          },
        ]),
      ]);

      const res = await request(app).get('/api/tweets/feed').set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toMatchObject({
        text: expect.any(String),
        author: {
          _id: expect.any(String),
          name: expect.any(String),
          username: expect.any(String),
          avatar: expect.any(String),
        },
      });
    });

    it('When access token is missing, should return 401 error', async () => {
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app).get('/api/tweets/feed');

      expect(res.statusCode).toBe(401);
    });

    it('When limit and page params are specified, should limit and return given page of tweets', async () => {
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([
          { user: userOne._id, following: [userTwo._id] },
          { user: userTwo._id, followers: [userOne._id] },
        ]),
        Tweet.insertMany([
          {
            author: userOne._id,
            text: faker.random.words(10),
          },
          {
            author: userTwo._id,
            text: faker.random.words(10),
          },
        ]),
      ]);

      const res = await request(app)
        .get('/api/tweets/feed')
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .query({ limit: 1, page: 2 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        results: expect.any(Array),
        page: 2,
        limit: 1,
        totalPages: 2,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(1);
    });
  });

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
        expect(res.body.results[0]).toMatchObject({
          text: tweet.text,
          author: {
            _id: tweet.author.toString(),
            name: expect.any(String),
            username: expect.any(String),
            avatar: expect.any(String),
          },
        });
      });

      it('When replyTo filter is not specified, by default, should not return tweets replies', async () => {
        const tweetId = mongoose.Types.ObjectId();
        const tweets = [
          { _id: tweetId, author: userOne._id, text: faker.lorem.words(10) },
          { author: userTwo._id, text: faker.lorem.words(10), replyTo: tweetId },
        ];
        await Promise.all([insertUsers([userOne, userTwo]), Tweet.create(tweets)]);

        const res = await request(app).get('/api/tweets');

        expect(res.statusCode).toBe(200);
        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0]._id).toBe(tweetId.toString());
      });

      it('When limit param is specified, should limit returned tweets', async () => {
        const tweets = [
          { author: userOne._id, text: faker.lorem.words(10) },
          { author: userOne._id, text: faker.lorem.words(10) },
        ];
        await Promise.all([insertUsers([userOne]), Tweet.insertMany(tweets)]);

        const res = await request(app).get('/api/tweets').query({ limit: 1 }).expect(200);

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

        const res = await request(app).get('/api/tweets').query({ limit: 1, page: 2 }).expect(200);

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
        await Promise.all([insertUsers([userOne, userTwo]), Tweet.insertMany(tweets)]);

        const res = await request(app).get('/api/tweets').query({ likes: userTwo._id.toString() }).expect(200);

        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0]).toHaveProperty('likes', [userTwo._id.toString()]);
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
        await Promise.all([insertUsers([userOne, userTwo]), Tweet.insertMany(tweets)]);

        const res = await request(app).get('/api/tweets').query({ retweets: userTwo._id.toString() }).expect(200);

        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0]).toHaveProperty('retweets', [userTwo._id.toString()]);
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
        await Promise.all([insertUsers([userOne, userTwo]), Tweet.insertMany(tweets)]);

        const res = await request(app).get('/api/tweets').query({ replyTo: tweetId.toString() }).expect(200);

        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0]).toHaveProperty('replyTo', tweetId.toString());
      });
    });

    describe('Returns 400 error if invalid mongo id provided', () => {
      it('When likes param is invalid mongo id, should return 400 error', async () => {
        const res = await request(app).get('/api/tweets').query({ likes: 'invalidId' });

        expect(res.statusCode).toBe(400);
      });

      it('When retweets param is invalid mongo id, should return 400 error', async () => {
        const res = await request(app).get('/api/tweets').query({ retweets: 'invalidId' });

        expect(res.statusCode).toBe(400);
      });

      it('When replyTo param is invalid mongo id, should return 400 error', async () => {
        const res = await request(app).get('/api/tweets').query({ replyTo: 'invalidId' });

        expect(res.statusCode).toBe(400);
      });
    });

    describe('Returns 404 error if resource with provided id does not exists', () => {
      it('When likes param is specified and user does not exists, should return 404 error', async () => {
        const res = await request(app).get('/api/tweets').query({ likes: userOne._id.toString() });

        expect(res.statusCode).toBe(404);
      });

      it('When retweets param is specified and user does not exists, should return 404 error', async () => {
        const res = await request(app).get('/api/tweets').query({ retweets: userOne._id.toString() });

        expect(res.statusCode).toBe(404);
      });

      it('When replyTo param is specified and tweet does not exists, should return 404 error', async () => {
        const tweetId = mongoose.Types.ObjectId();

        const res = await request(app).get('/api/tweets').query({ replyTo: tweetId.toString() });

        expect(res.statusCode).toBe(404);
      });
    });
  });

  describe('POST /api/tweets', () => {
    it('When data is ok, should add a tweet and return successful response with a new tweet', async () => {
      await insertUsers([userOne]);
      const tweet = {
        text: faker.lorem.words(10),
      };

      const res = await request(app)
        .post('/api/tweets')
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(tweet)
        .expect(201);

      expect(res.body.tweet).toMatchObject({
        text: tweet.text,
        author: userOne._id.toString(),
      });
      const dbTweet = await Tweet.findById(res.body.tweet._id);
      expect(dbTweet).toMatchObject({
        text: tweet.text,
        author: userOne._id,
      });
    });

    it('When data is ok, should add a tweet reply and return successful response with a new tweet', async () => {
      const tweet = {
        _id: mongoose.Types.ObjectId(),
        author: userOne._id,
        text: faker.lorem.words(10),
      };
      await Promise.all([insertUsers([userOne]), Tweet.insertMany([tweet])]);

      const newTweet = {
        text: faker.lorem.words(10),
        replyTo: tweet._id,
      };

      const res = await request(app)
        .post('/api/tweets')
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(newTweet)
        .expect(201);

      expect(res.body.tweet).toMatchObject({
        ...newTweet,
        replyTo: tweet._id.toString(),
        author: userOne._id.toString(),
      });
    });

    it('When access token is missing, should return 401 error', async () => {
      const newTweet = { text: faker.lorem.words(10) };

      const res = await request(app).post('/api/tweets').send(newTweet);

      expect(res.statusCode).toBe(401);
    });

    it('When required fields are not provided, should return 400 error', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post('/api/tweets')
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send({});

      expect(res.statusCode).toBe(400);
    });

    it('When tweet length is invalid, should return 400 error', async () => {
      await insertUsers([userOne]);
      const newTweet = { text: '' };

      const res = await request(app)
        .post('/api/tweets')
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(newTweet);

      expect(res.statusCode).toBe(400);
    });

    it('When replyTo tweet id is invalid mongo id, should return 400 error', async () => {
      await insertUsers([userOne]);
      const newTweet = { text: faker.lorem.words(10), replyTo: 'invalidId' };

      const res = await request(app)
        .post('/api/tweets')
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(newTweet);

      expect(res.statusCode).toBe(400);
    });

    it('When replyTo tweet does not exists, should return 404 error', async () => {
      await insertUsers([userOne]);
      const newTweet = {
        text: faker.lorem.words(10),
        replyTo: mongoose.Types.ObjectId(),
      };

      const res = await request(app)
        .post('/api/tweets')
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(newTweet);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/tweets/:tweetId', () => {
    it('When tweet exists, should return tweet with populated author data', async () => {
      await insertUsers([userOne]);
      const tweet = await Tweet.create({
        author: userOne._id,
        text: faker.lorem.words(10),
      });

      const res = await request(app).get(`/api/tweets/${tweet._id}`).expect(200);

      expect(res.body.tweet).toMatchObject({
        text: tweet.text,
        author: {
          _id: userOne._id.toString(),
          name: expect.any(String),
          username: expect.any(String),
          avatar: expect.any(String),
        },
      });
    });

    it('When tweetId is invalid mongo id, should return 400 error', async () => {
      const res = await request(app).get(`/api/tweets/invalidId`);

      expect(res.statusCode).toBe(400);
    });

    it('When tweet does not exists, should return 404 error', async () => {
      const res = await request(app).get(`/api/tweets/${mongoose.Types.ObjectId()}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/tweets/:tweetId', () => {
    it('When data is ok, should successfully update and return tweet', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userOne._id,
            text: faker.lorem.words(10),
          },
        ]),
      ]);

      const newTweet = { text: faker.random.words(10) };

      const res = await request(app)
        .patch(`/api/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(newTweet);

      expect(res.statusCode).toBe(200);
      expect(res.body.tweet).toMatchObject({
        text: newTweet.text,
        edited: true,
      });
      const dbTweet = await Tweet.findById(tweetId);
      expect(dbTweet.edited).toBe(true);
      expect(dbTweet.text).toBe(newTweet.text);
    });

    it('When tweetId is invalid mongo id, should return 400 error', async () => {
      await Promise.all([insertUsers([userOne])]);

      const newTweet = { text: faker.random.words(10) };

      const res = await request(app)
        .patch(`/api/tweets/invalidId`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(newTweet);

      expect(res.statusCode).toBe(400);
    });

    it('When tweet does not exists, should return 404 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([insertUsers([userOne])]);

      const newTweet = { text: faker.random.words(10) };

      const res = await request(app)
        .patch(`/api/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(newTweet);

      expect(res.statusCode).toBe(404);
    });

    it('When access token is missing, should return 401 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userOne._id,
            text: faker.lorem.words(10),
          },
        ]),
      ]);

      const newTweet = { text: faker.random.words(10) };

      const res = await request(app).patch(`/api/tweets/${tweetId}`).send(newTweet);

      expect(res.statusCode).toBe(401);
    });

    it("When user is trying to update another user's tweet, should return 403 error", async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userTwo._id,
            text: faker.lorem.words(10),
          },
        ]),
      ]);

      const newTweet = { text: faker.random.words(10) };

      const res = await request(app)
        .patch(`/api/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(newTweet);

      expect(res.statusCode).toBe(403);
    });

    it("When admin is trying to update another user's tweet, should successfully update", async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne, admin]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userOne._id,
            text: faker.lorem.words(10),
          },
        ]),
      ]);

      const newTweet = { text: faker.random.words(10) };

      const res = await request(app)
        .patch(`/api/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(newTweet);

      expect(res.statusCode).toBe(200);
      expect(res.body.tweet).toHaveProperty('text', newTweet.text);
    });

    it('When no tweet data is provided, should return 400 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userOne._id,
            text: faker.lorem.words(10),
          },
        ]),
      ]);

      const newTweet = {};

      const res = await request(app)
        .patch(`/api/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(newTweet);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /api/tweets/:tweetId', () => {
    it('When a user is deleting their tweet, should successfully delete', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userOne._id,
            text: faker.lorem.words(10),
          },
        ]),
      ]);

      const res = await request(app)
        .delete(`/api/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(200);
      const dbTweet = await Tweet.findById(tweetId);
      expect(dbTweet).toBeNull();
    });

    it('When access token is missing, should return 401 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userOne._id,
            text: faker.lorem.words(10),
          },
        ]),
      ]);

      const res = await request(app).delete(`/api/tweets/${tweetId}`);

      expect(res.statusCode).toBe(401);
    });

    it("When user is trying to delete another user's tweet, should return 403 error", async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userTwo._id,
            text: faker.lorem.words(10),
          },
        ]),
      ]);

      const res = await request(app)
        .delete(`/api/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(403);
    });

    it("When admin is trying to delete another user's tweet, should successfully delete", async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne, admin]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userOne._id,
            text: faker.lorem.words(10),
          },
        ]),
      ]);

      const res = await request(app)
        .delete(`/api/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${getAdminAccessToken()}`);

      expect(res.statusCode).toBe(200);
    });

    it('When admin is trying to delete their tweet, should successfully delete', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([admin]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: admin._id,
            text: faker.lorem.words(10),
          },
        ]),
      ]);

      const res = await request(app)
        .delete(`/api/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${getAdminAccessToken()}`);

      expect(res.statusCode).toBe(200);
    });

    it('When tweet does not exists, should return 404 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([insertUsers([userOne])]);

      const res = await request(app)
        .delete(`/api/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(404);
    });

    it('When tweetId is invalid mongo id, should return 400 error', async () => {
      await Promise.all([insertUsers([userOne])]);

      const res = await request(app)
        .delete(`/api/tweets/invalidId`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/tweets/like/:tweetId', () => {
    it('When tweet exists and user is authenticated, should like a tweet', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([{ user: userOne._id }, { user: userTwo._id }]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userTwo._id,
            text: faker.random.words(10),
          },
        ]),
      ]);

      const res = await request(app)
        .post(`/api/tweets/like/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.tweet.likes).toContain(userOne._id.toString());

      const [dbTweet, dbProfile] = await Promise.all([Tweet.findById(tweetId), Profile.findOne({ user: userOne._id })]);
      expect(dbTweet.likes).toContainEqual(userOne._id);
      expect(dbProfile.likes).toContainEqual(tweetId);
    });

    it('When access token is missing, should return 401 error', async () => {
      const tweetId = mongoose.Types.ObjectId();

      const res = await request(app).post(`/api/tweets/like/${tweetId}`);

      expect(res.statusCode).toBe(401);
    });

    it('When tweet does not exists, should return 404 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app)
        .post(`/api/tweets/like/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(404);
    });

    it('When tweetId is invalid mongo id, should return 400 error', async () => {
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app)
        .post(`/api/tweets/like/invalidId`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(400);
    });

    it('When user already likes a tweet, should return 400 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne]),
        Profile.insertMany([{ user: userOne._id, likes: [tweetId] }]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userOne._id,
            text: faker.random.words(10),
            likes: [userOne._id],
          },
        ]),
      ]);

      const res = await request(app)
        .post(`/api/tweets/like/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /api/tweets/like/:tweetId', () => {
    it('When tweet exists and user is authenticated, should successfully remove like from a tweet', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([{ user: userOne._id, likes: [tweetId] }, { user: userTwo._id }]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userTwo._id,
            text: faker.random.words(10),
            likes: [userOne._id],
          },
        ]),
      ]);

      const res = await request(app)
        .delete(`/api/tweets/like/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.tweet.likes).toHaveLength(0);

      const [dbTweet, dbProfile] = await Promise.all([Tweet.findById(tweetId), Profile.findOne({ user: userOne._id })]);
      expect(dbTweet.likes).toHaveLength(0);
      expect(dbProfile.likes).toHaveLength(0);
    });

    it('When access token is missing, should return 401 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne]),
        Profile.insertMany([{ user: userOne._id, likes: [tweetId] }]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userOne._id,
            text: faker.random.words(10),
            likes: [userOne._id],
          },
        ]),
      ]);

      const res = await request(app).delete(`/api/tweets/like/${tweetId}`);

      expect(res.statusCode).toBe(401);
    });

    it('When tweet does not exists, should return 404 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id, likes: [tweetId] }])]);

      const res = await request(app)
        .delete(`/api/tweets/like/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(404);
    });

    it('When tweetId is invalid mongo id, should return 400 error', async () => {
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app)
        .delete(`/api/tweets/like/invalidId`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(400);
    });

    it('When user did not like a tweet yet, should return 400 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([{ user: userOne._id }, { user: userTwo._id }]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userTwo._id,
            text: faker.random.words(10),
          },
        ]),
      ]);

      const res = await request(app)
        .delete(`/api/tweets/like/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/tweets/retweet/:tweetId', () => {
    it('When tweet exists and user is authenticated, should retweet a tweet', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([{ user: userOne._id }, { user: userTwo._id }]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userTwo._id,
            text: faker.random.words(10),
          },
        ]),
      ]);

      const res = await request(app)
        .post(`/api/tweets/retweet/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.tweet.retweets).toContain(userOne._id.toString());

      const [dbTweet, dbProfile] = await Promise.all([Tweet.findById(tweetId), Profile.findOne({ user: userOne._id })]);
      expect(dbTweet.retweets).toContainEqual(userOne._id);
      expect(dbProfile.retweets).toContainEqual(tweetId);
    });

    it('When access token is missing, should return 401 error', async () => {
      const tweetId = mongoose.Types.ObjectId();

      const res = await request(app).post(`/api/tweets/retweet/${tweetId}`);

      expect(res.statusCode).toBe(401);
    });

    it('When tweet does not exists, should return 404 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app)
        .post(`/api/tweets/retweet/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(404);
    });

    it('When tweetId is invalid mongo id, should return 400 error', async () => {
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app)
        .post(`/api/tweets/retweet/invalidId`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(400);
    });

    it('When user already retweeted a tweet, should return 400 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne]),
        Profile.insertMany([{ user: userOne._id, retweets: [tweetId] }]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userOne._id,
            text: faker.random.words(10),
            retweets: [userOne._id],
          },
        ]),
      ]);

      const res = await request(app)
        .post(`/api/tweets/retweet/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /api/tweets/retweet/:tweetId', () => {
    it('When tweet exists and user is authenticated, should successfully un retweet a tweet', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([{ user: userOne._id, retweets: [tweetId] }, { user: userTwo._id }]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userTwo._id,
            text: faker.random.words(10),
            retweets: [userOne._id],
          },
        ]),
      ]);

      const res = await request(app)
        .delete(`/api/tweets/retweet/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.tweet.retweets).toHaveLength(0);

      const [dbTweet, dbProfile] = await Promise.all([Tweet.findById(tweetId), Profile.findOne({ user: userOne._id })]);
      expect(dbTweet.retweets).toHaveLength(0);
      expect(dbProfile.retweets).toHaveLength(0);
    });

    it('When access token is missing, should return 401 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne]),
        Profile.insertMany([{ user: userOne._id, retweets: [tweetId] }]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userOne._id,
            text: faker.random.words(10),
            retweets: [userOne._id],
          },
        ]),
      ]);

      const res = await request(app).delete(`/api/tweets/retweet/${tweetId}`);

      expect(res.statusCode).toBe(401);
    });

    it('When tweet does not exists, should return 404 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id, retweets: [tweetId] }])]);

      const res = await request(app)
        .delete(`/api/tweets/retweet/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(404);
    });

    it('When tweetId is invalid mongo id, should return 400 error', async () => {
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app)
        .delete(`/api/tweets/retweet/invalidId`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(400);
    });

    it('When user did not retweet a tweet yet, should return 400 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([{ user: userOne._id }, { user: userTwo._id }]),
        Tweet.insertMany([
          {
            _id: tweetId,
            author: userTwo._id,
            text: faker.random.words(10),
          },
        ]),
      ]);

      const res = await request(app)
        .delete(`/api/tweets/retweet/${tweetId}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(400);
    });
  });
});
