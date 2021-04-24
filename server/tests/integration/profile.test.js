const request = require('supertest');
const faker = require('faker');
const mongoose = require('mongoose');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { getAdminAccessToken, getUserOneAccessToken } = require('../fixtures/token.fixture');
const { admin, userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { Profile } = require('../../src/components/profiles');
const Tweet = require('../../src/components/tweets/tweet.model');

setupTestDB();

describe('Profiles routes', () => {
  describe('GET /api/profiles', () => {
    it('Should return 200 with profiles with populated user data and apply default query options', async () => {
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([{ user: userOne._id }, { user: userTwo._id }]),
      ]);

      const res = await request(app).get('/api/profiles');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toHaveProperty('user');
      expect(res.body.results[0].user).toHaveProperty('name');
      expect(res.body.results[0].user).toHaveProperty('username');
      expect(res.body.results[0].user).toHaveProperty('avatar');
    });

    it('When limit param is specified, should limit returned array', async () => {
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([{ user: userOne._id }, { user: userTwo._id }]),
      ]);

      const res = await request(app).get('/api/profiles').query({ limit: 1 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 1,
        totalPages: 2,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(1);
    });

    it('When page and limit are specified, should return correct page', async () => {
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([{ user: userOne._id }, { user: userTwo._id }]),
      ]);

      const res = await request(app).get('/api/profiles').query({ limit: 1, page: 2 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 2,
        limit: 1,
        totalPages: 2,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(1);
    });

    it('When followers filter is applied, should return profiles user follows', async () => {
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([
          { user: userOne._id, following: [userTwo._id] },
          { user: userTwo._id, followers: [userOne._id] },
        ]),
      ]);

      const res = await request(app).get('/api/profiles').query({ followers: userOne._id.toString() });

      expect(res.statusCode).toBe(200);
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].user._id).toBe(userTwo._id.toString());
    });

    it('When following filter is applied, should return profile followers', async () => {
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([
          { user: userOne._id, following: [userTwo._id] },
          { user: userTwo._id, followers: [userOne._id] },
        ]),
      ]);

      const res = await request(app).get('/api/profiles').query({ following: userTwo._id.toString() });

      expect(res.statusCode).toBe(200);
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].user._id).toBe(userOne._id.toString());
    });

    it('When likes filter is applied, should return profiles who liked a tweet', async () => {
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

      const res = await request(app).get('/api/profiles').query({ likes: tweetId.toString() });

      expect(res.statusCode).toBe(200);
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].user).toMatchObject({
        _id: userOne._id.toString(),
      });
    });

    it('When retweets filter is applied, should return profiles who retweeted a tweet', async () => {
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

      const res = await request(app).get('/api/profiles').query({ retweets: tweetId.toString() });

      expect(res.statusCode).toBe(200);
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].user).toMatchObject({
        _id: userOne._id.toString(),
      });
    });

    it('When following filter is applied and profile does not exists, should return 404 error', async () => {
      await Promise.all([
        insertUsers([userOne]),
        Profile.insertMany([{ user: userOne._id, following: [userTwo._id] }]),
      ]);

      const res = await request(app).get('/api/profiles').query({ following: userTwo._id.toString() });

      expect(res.statusCode).toBe(404);
    });

    it('When followers filter is applied and profile does not exists, should return 404 error', async () => {
      await Promise.all([
        insertUsers([userOne]),
        Profile.insertMany([{ user: userOne._id, followers: [userTwo._id] }]),
      ]);

      const res = await request(app).get('/api/profiles').query({ followers: userTwo._id.toString() });

      expect(res.statusCode).toBe(404);
    });

    it('When likes filter is applied and tweet does not exists, should return 404 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id, likes: [tweetId] }])]);

      const res = await request(app).get('/api/profiles').query({ likes: tweetId.toString() });

      expect(res.statusCode).toBe(404);
    });

    it('When retweets filter is applied and tweet does not exists, should return 404 error', async () => {
      const tweetId = mongoose.Types.ObjectId();
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id, retweets: [tweetId] }])]);

      const res = await request(app).get('/api/profiles').query({ retweets: tweetId.toString() });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/profiles/:userId', () => {
    it('When userId is ok, should return 200 and profile with populated user data', async () => {
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app).get(`/api/profiles/${userOne._id}`).send().expect(200);

      expect(res.body).toHaveProperty('profile');
      expect(res.body.profile).toHaveProperty('user');
      expect(res.body.profile.user.name).toBe(userOne.name);
      expect(res.body.profile.user.username).toBe(userOne.username.toLowerCase());
      expect(res.body.profile.user.avatar).toBe(userOne.avatar);
    });

    it('When invalid object id, should return 400 error', async () => {
      const res = await request(app).get('/api/profiles/invalidId').send();

      expect(res.statusCode).toBe(400);
    });

    it('When profile does not exists, should return 404 error', async () => {
      const res = await request(app).get(`/api/profiles/${userOne._id}`).send();

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/profiles/:userId', () => {
    let newProfile;

    beforeEach(() => {
      newProfile = {
        bio: faker.lorem.sentence(),
        location: faker.address.city() + ' ' + faker.address.country(),
        birthday: faker.date.past(30),
        backgroundImage: faker.image.imageUrl(),
      };
    });

    it('When profile data is ok, should update a profile', async () => {
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app)
        .patch(`/api/profiles/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(newProfile)
        .expect(200);

      expect(res.body).toHaveProperty('profile');
      expect(res.body.profile).toHaveProperty('birthday');
      expect(res.body.profile.user).toBe(userOne._id.toHexString());
      expect(res.body.profile.bio).toBe(newProfile.bio);
      expect(res.body.profile.location).toBe(newProfile.location);
      expect(res.body.profile.backgroundImage).toBe(newProfile.backgroundImage);
    });

    it('When access token is missing, should return 401 error', async () => {
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app).patch(`/api/profiles/${userOne._id}`).send(newProfile);

      expect(res.statusCode).toBe(401);
    });

    it("When user is updating another user's profile, should return 403 error", async () => {
      await Promise.all([insertUsers([userOne, userTwo]), Profile.insertMany([{ user: userTwo._id }])]);

      const res = await request(app)
        .patch(`/api/profiles/${userTwo._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(newProfile);

      expect(res.statusCode).toBe(403);
    });

    it("When admin is updating another user's profile, should successfully update and return 200", async () => {
      await Promise.all([insertUsers([userOne, admin]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app)
        .patch(`/api/profiles/${userOne._id}`)
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(newProfile);

      expect(res.statusCode).toBe(200);
    });

    it("When updating user's profile that does not exists, should return 404", async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .patch(`/api/profiles/${userOne._id}`)
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(newProfile);

      expect(res.statusCode).toBe(404);
    });

    it('When userId is invalid, should return 400 error', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .patch(`/api/profiles/invalidId`)
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(newProfile);

      expect(res.statusCode).toBe(400);
    });

    it('When empty request body, should return 400 error', async () => {
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app)
        .patch(`/api/profiles/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/profiles/follow/:userId', () => {
    it('When data is ok, should follow profile', async () => {
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([{ user: userOne._id }, { user: userTwo._id }]),
      ]);

      const res = await request(app)
        .post(`/api/profiles/follow/${userTwo._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send();

      expect(res.statusCode).toBe(200);

      const [dbProfileOne, dbProfileTwo] = await Promise.all([
        Profile.findOne({ user: userOne._id }),
        Profile.findOne({ user: userTwo._id }),
      ]);

      expect(dbProfileOne.isFollowing(dbProfileTwo.user)).toBe(true);
      expect(dbProfileTwo.followers.includes(dbProfileOne.user)).toBe(true);
    });

    it('When userId is invalid, should return 400 error', async () => {
      await Promise.all([insertUsers([userOne])]);

      const res = await request(app)
        .post(`/api/profiles/follow/invalidId`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send();

      expect(res.statusCode).toBe(400);
    });

    it('When access token is missing, should return 401 error', async () => {
      await Promise.all([insertUsers([userTwo]), Profile.insertMany([{ user: userTwo._id }])]);

      const res = await request(app).post(`/api/profiles/follow/${userTwo._id}`).send();

      expect(res.statusCode).toBe(401);
    });

    it('When profile does not exists, should return 404 error', async () => {
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app)
        .post(`/api/profiles/follow/${userTwo._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send();

      expect(res.statusCode).toBe(404);
    });

    it('When user is trying to follow their profile, should return 400 error', async () => {
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app)
        .post(`/api/profiles/follow/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send();

      expect(res.statusCode).toBe(400);
    });

    it('When user already follow profile, should return 400 error', async () => {
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([
          { user: userOne._id, following: [userTwo._id] },
          { user: userTwo._id, followers: [userOne._id] },
        ]),
      ]);

      const res = await request(app)
        .post(`/api/profiles/follow/${userTwo._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send();

      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /api/profiles/follow/:userId', () => {
    it('When data is ok, should unfollow profile', async () => {
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([
          { user: userOne._id, following: [userTwo._id] },
          { user: userTwo._id, followers: [userOne._id] },
        ]),
      ]);

      const res = await request(app)
        .delete(`/api/profiles/follow/${userTwo._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send()
        .expect(200);

      expect(res.statusCode).toBe(200);

      const [dbProfileOne, dbProfileTwo] = await Promise.all([
        Profile.findOne({ user: userOne._id }),
        Profile.findOne({ user: userTwo._id }),
      ]);

      expect(dbProfileOne.isFollowing(dbProfileTwo.user)).toBe(false);
      expect(dbProfileTwo.followers.includes(dbProfileOne.user)).toBe(false);
    });

    it('When userId is invalid, should return 400 error', async () => {
      await Promise.all([insertUsers([userOne])]);

      const res = await request(app)
        .delete(`/api/profiles/follow/invalidId`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send();

      expect(res.statusCode).toBe(400);
    });

    it('When access token is missing, should return 401 error', async () => {
      await Promise.all([insertUsers([userTwo]), Profile.insertMany([{ user: userTwo._id }])]);

      const res = await request(app).delete(`/api/profiles/follow/${userTwo._id}`).send();

      expect(res.statusCode).toBe(401);
    });

    it('When profile does not exists, should return 404 error', async () => {
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app)
        .delete(`/api/profiles/follow/${userTwo._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send();

      expect(res.statusCode).toBe(404);
    });

    it('When user is trying to unfollow their profile, should return 400 error', async () => {
      await Promise.all([insertUsers([userOne]), Profile.insertMany([{ user: userOne._id }])]);

      const res = await request(app)
        .delete(`/api/profiles/follow/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send();

      expect(res.statusCode).toBe(400);
    });

    it('When user does not follow profile, should return 400 error', async () => {
      await Promise.all([
        insertUsers([userOne, userTwo]),
        Profile.insertMany([{ user: userOne._id }, { user: userTwo._id }]),
      ]);

      const res = await request(app)
        .delete(`/api/profiles/follow/${userTwo._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send();

      expect(res.statusCode).toBe(400);
    });
  });
});
