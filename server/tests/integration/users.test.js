const request = require('supertest');
const faker = require('faker');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { User } = require('../../src/components/users');
const { getAdminUserToken } = require('../fixtures/token.fixture');
const { admin, insertUsers } = require('../fixtures/user.fixture');
const { formatUsername } = require('../../src/utils/helpers');

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
      };
    });

    it('When data is ok, should return 201 and create new user', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${getAdminUserToken()}`)
        .send(newUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user).toMatchObject({
        _id: expect.anything(),
        name: newUser.name,
        email: newUser.email.toLowerCase(),
        username: formatUsername(newUser.username),
        role: newUser.role,
      });

      const dbUser = await User.findById(res.body.user.id);
      expect(dbUser).toBeDefined();
    });
  });

  describe('GET /api/users', () => {
    it('When user is admin, it should return users', async () => {});
  });
});
