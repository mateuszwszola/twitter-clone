const request = require('supertest');
const faker = require('faker');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { getAdminAccessToken, getUserOneAccessToken } = require('../fixtures/token.fixture');
const { admin, userOne, insertUsers, userTwo } = require('../fixtures/user.fixture');
const { formatUsername } = require('../../src/utils/helpers');
const { User } = require('../../src/components/users');
const Profile = require('../../src/components/profiles/profile.model');
const Tweet = require('../../src/components/tweets/tweet.model');

setupTestDB();

describe('Users routes', () => {
  describe('POST /api/users', () => {
    let newUser;

    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: 'password123',
        role: 'user',
        avatar: faker.image.avatar(),
      };
    });

    it('When data is ok, should return 201 and create new user', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(newUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user).toMatchObject({
        _id: expect.anything(),
        name: newUser.name,
        email: newUser.email.toLowerCase(),
        username: formatUsername(newUser.username),
        role: newUser.role,
        avatar: newUser.avatar,
      });

      const { _id: userId } = res.body.user;
      const [dbUser, dbProfile] = await Promise.all([User.findById(userId), Profile.findOne({ user: userId })]);
      expect(dbUser).toBeDefined();
      expect(dbProfile).toBeDefined();
      expect(dbUser.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        name: newUser.name,
        email: newUser.email.toLowerCase(),
        username: formatUsername(newUser.username),
        role: newUser.role,
        avatar: newUser.avatar,
      });
    });

    it('When new user role is admin, should return 201 and create new admin user', async () => {
      await insertUsers([admin]);
      newUser.role = 'admin';

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(newUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.user.role).toBe('admin');

      const { _id: userId } = res.body.user;
      const [dbUser, dbProfile] = await Promise.all([User.findById(userId), Profile.findOne({ user: userId })]);
      expect(dbUser).toBeDefined();
      expect(dbProfile).toBeDefined();
      expect(dbUser.role).toBe('admin');
    });

    it('When access token is missing, should return 401 error', async () => {
      const res = await request(app).post('/api/users').send(newUser);

      expect(res.statusCode).toBe(401);
    });

    it('When logged in user is not admin, should return 403 error', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(newUser);

      expect(res.statusCode).toBe(403);
    });

    it('When username length is invalid, should return 400 error', async () => {
      await insertUsers([admin]);
      newUser.username = 'U';

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(newUser);

      expect(res.statusCode).toBe(400);
    });

    it('When password length is invalid, should return 400 error', async () => {
      await insertUsers([admin]);
      newUser.password = 'passwd';

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(newUser);

      expect(res.statusCode).toBe(400);
    });

    it('When email is invalid, should return 400 error', async () => {
      await insertUsers([admin]);
      newUser.email = 'invalidEmail';

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(newUser);

      expect(res.statusCode).toBe(400);
    });

    it('When email is already in use, should return 400 error', async () => {
      await insertUsers([admin, userOne]);
      newUser.email = userOne.email;

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(newUser);

      expect(res.statusCode).toBe(400);
    });

    it('When username is already in use, should return 400 error', async () => {
      await insertUsers([admin, userOne]);
      newUser.username = userOne.username;

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(newUser);

      expect(res.statusCode).toBe(400);
    });

    it('When user role is unknown, should return 400 error', async () => {
      await insertUsers([admin]);
      newUser.role = 'boss';

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(newUser);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/users', () => {
    it('Should return 200 with users and apply the default query options', async () => {
      await insertUsers([userOne, userTwo, admin]);

      const res = await request(app).get('/api/users').set('Authorization', `Bearer ${getAdminAccessToken()}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
    });

    it('When access token is missing, should return 401', async () => {
      await insertUsers([userOne, userTwo, admin]);

      const res = await request(app).get('/api/users');

      expect(res.statusCode).toBe(401);
    });

    it('When non-admin is trying to access all users, should return 403', async () => {
      await insertUsers([userOne, userTwo, admin]);

      const res = await request(app).get('/api/users').set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(403);
    });

    it('When filter on name field is applied, should return correct results', async () => {
      await insertUsers([userOne, userTwo, admin]);

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .query({ name: userOne.name });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0]._id).toBe(userOne._id.toString());
    });

    it('When filter on role field is applied, should return correct results', async () => {
      await insertUsers([userOne, userTwo, admin]);

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .query({ role: 'user' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].role).toBe('user');
      expect(res.body.results[1].role).toBe('user');
    });

    it('When limit param is specified, should limit returned array', async () => {
      await insertUsers([userOne, userTwo, admin]);

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .query({ limit: 2 });

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(2);
    });

    it('When page and limit param are specified, should return correct page', async () => {
      await insertUsers([userOne, userTwo, admin]);

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .query({ page: 2, limit: 2 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 2,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(1);
    });
  });

  describe('GET /api/users/:userId', () => {
    it('When user is the owner, should return 200 and a user', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .get(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toMatchObject({
        _id: userOne._id.toString(),
        name: userOne.name,
        email: userOne.email.toLowerCase(),
        role: userOne.role,
        username: formatUsername(userOne.username),
      });
    });

    it('When access token is missing, should return 401 error', async () => {
      await insertUsers([userOne]);

      const res = await request(app).get(`/api/users/${userOne._id}`);

      expect(res.statusCode).toBe(401);
    });

    it('When user is trying to get another user, should return 403 error', async () => {
      await insertUsers([userOne, userTwo]);

      const res = await request(app)
        .get(`/api/users/${userTwo._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(403);
    });

    it('When admin is trying to get another user, should return 200 and user', async () => {
      await insertUsers([userOne, admin]);

      const res = await request(app)
        .get(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getAdminAccessToken()}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user._id.toString()).toBe(userOne._id.toString());
    });

    it('When userId is not a valid mongo id, should return 400 error', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .get('/api/users/invalidId')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('PATCH /api/users/:userId', () => {
    it('When user data is ok, should update a user', async () => {
      await insertUsers([userOne]);
      const updateBody = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'newPassword1',
        avatar: faker.image.avatar(),
      };

      const res = await request(app)
        .patch(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(200);

      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user).toMatchObject({
        _id: userOne._id.toHexString(),
        name: updateBody.name,
        email: updateBody.email,
        role: 'user',
        avatar: updateBody.avatar,
      });

      const dbUser = await User.findById(userOne._id);
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(updateBody.password);
      expect(dbUser).toMatchObject({
        name: updateBody.name,
        email: updateBody.email,
        role: 'user',
        avatar: updateBody.avatar,
      });
    });

    it('When access token is missing, should return 401 error', async () => {
      await insertUsers([userOne]);
      const updateBody = { name: faker.name.findName() };

      const res = await request(app).patch(`/api/users/${userOne._id}`).send(updateBody);

      expect(res.statusCode).toBe(401);
    });

    it('When user is updating another user, should return 403 error', async () => {
      await insertUsers([userOne, userTwo]);
      const updateBody = { name: faker.name.findName() };

      const res = await request(app)
        .patch(`/api/users/${userTwo._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(403);
    });

    it('When user is trying to update its role, should not update and return 400', async () => {
      await insertUsers([userOne]);
      const updateBody = { role: 'admin' };

      const res = await request(app)
        .patch(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(400);
    });

    it('When admin is updating another user, should successfully update user and return 200', async () => {
      await insertUsers([userOne, admin]);
      const updateBody = { name: faker.name.findName() };

      const res = await request(app)
        .patch(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(200);
    });

    it('When admin is updating another user role, should successfully update and return 200', async () => {
      await insertUsers([userOne, admin]);
      const updateBody = { role: 'admin' };

      const res = await request(app)
        .patch(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(200);

      const dbUser = await User.findById(userOne._id);
      expect(dbUser.role).toBe('admin');
    });

    it('When admin is trying to update user that does not exists, should return 404', async () => {
      await insertUsers([admin]);
      const updateBody = { name: faker.name.findName() };

      const res = await request(app)
        .patch(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(404);
    });

    it('When userId is not a valid mongo id, should return 400 error', async () => {
      await insertUsers([admin]);
      const updateBody = { name: faker.name.findName() };

      const res = await request(app)
        .patch('/api/users/invalidId')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(400);
    });

    it('When email is invalid, should return 400 error', async () => {
      await insertUsers([userOne]);
      const updateBody = { email: 'invalidEmail' };

      const res = await request(app)
        .patch(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(400);
    });

    it('When email is already taken, should return 400 error', async () => {
      await insertUsers([userOne, userTwo]);
      const updateBody = { email: userTwo.email };

      const res = await request(app)
        .patch(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(400);
    });

    it('When email is my email, should not return 400 error', async () => {
      await insertUsers([userOne]);
      const updateBody = { email: userOne.email };

      const res = await request(app)
        .patch(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(200);
    });

    it('When username is already taken, should return 400 error', async () => {
      await insertUsers([userOne, userTwo]);
      const updateBody = { username: userTwo.username };

      const res = await request(app)
        .patch(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(400);
    });

    it('When username is my username, should not return 400 error', async () => {
      await insertUsers([userOne]);
      const updateBody = { username: userOne.username };

      const res = await request(app)
        .patch(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(200);
    });

    it('When password is less than 8 characters, should return 400 error', async () => {
      await insertUsers([userOne]);
      const updateBody = { password: 'passwd1' };

      const res = await request(app)
        .patch(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(400);
    });

    it('When password does not contain both letters and numbers, should return 400 error', async () => {
      await insertUsers([userOne]);
      const updateBody = { password: 'password' };

      const res = await request(app)
        .patch(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`)
        .send(updateBody);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('When owner is deleting, should delete user, their profile and tweets, and return 200', async () => {
      await insertUsers([userOne]);
      await Profile.create({ user: userOne._id });
      await Tweet.insertMany([
        {
          author: userOne._id,
          text: faker.random.words(10),
        },
      ]);

      const res = await request(app)
        .delete(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(200);

      const [dbUser, dbProfile, dbTweets] = await Promise.all([
        User.findById(userOne._id),
        Profile.findOne({ user: userOne._id }),
        Tweet.find({ author: userOne._id }),
      ]);

      expect(dbUser).toBeNull();
      expect(dbProfile).toBeNull();
      expect(dbTweets).toHaveLength(0);
    });

    it('When admin is deleting another user, should delete and return 200', async () => {
      await insertUsers([userOne, admin]);

      const res = await request(app)
        .delete(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getAdminAccessToken()}`);

      expect(res.statusCode).toBe(200);
    });

    it('When user is deleting another user, should return 403 error', async () => {
      await insertUsers([userOne, userTwo]);

      const res = await request(app)
        .delete(`/api/users/${userTwo._id}`)
        .set('Authorization', `Bearer ${getUserOneAccessToken()}`);

      expect(res.statusCode).toBe(403);
    });

    it('When access token is missing, should return 401 error', async () => {
      await insertUsers([userOne]);

      const res = await request(app).delete(`/api/users/${userOne._id}`);

      expect(res.statusCode).toBe(401);
    });

    it('When user does not exists, should return 404 error', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .delete(`/api/users/${userOne._id}`)
        .set('Authorization', `Bearer ${getAdminAccessToken()}`);

      expect(res.statusCode).toBe(404);
    });

    it('When mongo id is invalid, should return 400 error', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .delete('/api/users/invalidId')
        .set('Authorization', `Bearer ${getAdminAccessToken()}`);

      expect(res.statusCode).toBe(400);
    });
  });
});
