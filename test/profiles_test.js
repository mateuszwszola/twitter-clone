// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
// Require the dev-dependencies
const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

const server = require('../app');
// Require models
const User = require('../models/User');
const Profile = require('../models/Profile');

const API_URL = '/api/profiles';
let JWT_TOKEN = null;

const { dummyUser, dummyUsers } = require('./dummy_data');

const generateJwtToken = require('../helpers/generateJwtToken');
const generateMongoObjectId = require('../helpers/generateMongoObjectId');
const { testNoTokenError } = require('./helpers');

describe('Profiles', function() {
    beforeEach(async function() {
        await User.deleteMany({});
        await Profile.deleteMany({});
    });

    // GET current user profile
   describe('GET /api/profiles', function() {
       it('should not GET logged in user and return error for lack of jwt token', async function() {
           const res = await chai.request(server)
               .get(API_URL);

           testNoTokenError(res);
       });

       it('should GET logged in user profile',  async function() {
           const user = await new User(dummyUser).save();
           const profile = await new Profile({ user: user.id }).save();

           JWT_TOKEN = await generateJwtToken(user.id);
           const res = await chai.request(server)
               .get(API_URL)
               .set('x-auth-token', JWT_TOKEN);

           testBasicProfile(res, profile.id, user);
       });
   });
    // GET all profiles
   describe('GET /api/profiles/all', function() {
      it('should GET all the profiles', async function() {
          const res = await chai.request(server)
              .get(`${API_URL}/all`);

          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
      });
   });
    // GET profile by user ID
   describe('GET /api/profiles/:user_id', function() {
       it('should not GET profile and return error when profile does not exists', async function() {
           const objectId = await generateMongoObjectId();
           const res = await chai.request(server)
               .get(`${API_URL}/${objectId}`);

           testNotFoundProfile(res);
       });

       it('should GET and return profile for user_id', async function() {
           const user = await new User(dummyUser).save();
           const profile = await new Profile({ user: user.id }).save();

           const res = await chai.request(server)
               .get(`${API_URL}/${user.id}`);

           testBasicProfile(res, profile.id, user);
       });
   });
    // GET profile by username
   describe('GET /api/profiles/username/:username', function() {
        it('should not GET a profile when user with that username does not exists',async function() {
            const res = await chai.request(server)
                .get(`${API_URL}/username/${dummyUser.username}`);

            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors[0].should.have.property('msg', 'User with that username does not exists');
        });

        it('should GET a profile', async function() {
            const user = await new User(dummyUser).save();
            const profile = await new Profile({ user: user.id }).save();

            const res = await chai.request(server)
                .get(`${API_URL}/username/${user.username}`);

            testBasicProfile(res, profile.id, user);
        });
   });
    // Update the profile
   describe('POST /api/profiles', function() {
        it('should POST and update the profile', async function() {
            const user = await new User(dummyUser).save();
            const profile = await new Profile({ user: user.id }).save();

            JWT_TOKEN = await generateJwtToken(user.id);

            const body = {
                bio: `My name is ${dummyUser.name}`,
                location: 'New York City',
                website: `${dummyUser.username}.com`
            };

            const res = await chai.request(server)
                .post(`${API_URL}`)
                .set('x-auth-token', JWT_TOKEN)
                .send(body);

            res.should.have.status(200);

            const updatedProfile = await Profile.findById(profile.id);
            updatedProfile.should.have.a('object');
            updatedProfile.should.have.property('bio', body.bio);
            updatedProfile.should.have.property('location', body.location);
            updatedProfile.should.have.property('website', body.website);
        });

        it('should POST and update the profile by resetting some fields', async function() {
            const user = await new User(dummyUser).save();
            const profileData = {
                bio: `My name is ${dummyUser.name}`,
                location: 'New York City',
                website: `${dummyUser.username}.com`
            };
            const profile = await new Profile({ user: user.id, ...profileData }).save();

            JWT_TOKEN = await generateJwtToken(user.id);

            const body = {
                bio: '',
                location: '',
                website: ''
            };

            const res = await chai.request(server)
                .post(`${API_URL}`)
                .set('x-auth-token', JWT_TOKEN)
                .send(body);

            res.should.have.status(200);

            const updatedProfile = await Profile.findById(profile.id);
            updatedProfile.should.have.a('object');
            updatedProfile.should.have.property('bio', body.bio);
            updatedProfile.should.have.property('location', body.location);
            updatedProfile.should.have.property('website', body.website);
        });

        it('should not POST when given username is already in use', async function() {
            await new User(dummyUsers[0]).save();
            const user = await new User(dummyUsers[1]);
            await new Profile({ user: user.id }).save();

            JWT_TOKEN = await generateJwtToken(user.id);

            const res = await chai.request(server)
                .post(`${API_URL}`)
                .set('x-auth-token', JWT_TOKEN)
                .send({ username: dummyUsers[0].username });

            res.should.have.status(422);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors[0].should.have.property('msg', 'username already in use');
        });

        it('should not POST when trying to reset name and username', async function() {
            const user = await new User(dummyUser).save();
            await new Profile({ user: user.id }).save();

            JWT_TOKEN = await generateJwtToken(user.id);

            const res = await chai.request(server)
                .post(`${API_URL}`)
                .set('x-auth-token', JWT_TOKEN)
                .send({ username: '', name: '' });

            res.should.have.status(422);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.length.should.be.eql(2);
        });
   });
    // Delete the profile
   describe('DELETE /api/profiles', function() {
       it('should not DELETE account when no token provided', async function() {
           const res = await chai.request(server)
               .delete(`${API_URL}`);

           testNoTokenError(res);
       });

       it('should DELETE account and return success message', async function() {
           const user = await new User(dummyUser).save();
           const profile = await new Profile({ user: user.id }).save();

           JWT_TOKEN = await generateJwtToken(user.id);

           const res = await chai.request(server)
               .delete(`${API_URL}`)
               .set('x-auth-token', JWT_TOKEN);

           res.should.have.status(200);
           res.body.should.be.a('object');
           res.body.should.have.property('message', 'Success');

           const deletedUser = await User.findById(user.id);
           const deletedProfile = await Profile.findById(profile.id);

           expect(deletedUser).to.be.eql(null);
           expect(deletedProfile).to.be.eql(null);
       });
   });

    // GET profile list of followers profiles
    describe('GET /api/profiles/follow/:user_id/followers', function() {
        it('should not GET list of followers when user does not exists', async function() {
            const objectId = await generateMongoObjectId();

            const res = await chai.request(server)
                .get(`${API_URL}/follow/${objectId}/followers`);

            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors[0].should.have.property('msg', 'User does not exists');
        });

        it('should GET list of followers', async function() {
            const user = await new User(dummyUser).save();
            await new Profile({ user: user.id }).save();

            const res = await chai.request(server)
                .get(`${API_URL}/follow/${user.id}/followers`);

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
        });
    });

   // GET profile list of following profiles
    describe('GET /api/profiles/follow/:user_id/following', function() {
        it('should not GET list of following when profile does not exists', async function() {
            const objectId = await generateMongoObjectId();
            const res = await chai.request(server)
                .get(`${API_URL}/follow/${objectId}/following`);

            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors[0].should.have.property('msg', 'User does not exists');
        });

        it('should GET list of following profiles', async function() {
            const user = await new User(dummyUser).save();
            await new Profile({ user: user.id }).save();

            const res = await chai.request(server)
                .get(`${API_URL}/follow/${user.id}/following`);

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
        });
    });

    // Follow a user
    describe('POST /api/profiles/follow/:user_id', function() {
        const objectId = generateMongoObjectId();
        it('should not POST when token not provided', async function() {
            const res = await chai.request(server)
                .post(`${API_URL}/follow/${objectId}`);

            testNoTokenError(res);
        });

        it('should not POST when trying to follow own profile', async function() {
            const user = await new User(dummyUser).save();

            JWT_TOKEN = await generateJwtToken(user.id);

            const res = await chai.request(server)
                .post(`${API_URL}/follow/${user.id}`)
                .set('x-auth-token', JWT_TOKEN);

            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors[0].should.have.property('msg', 'You cannot follow your own profile');
        });

        it('should not POST when already followed that profile', async function() {
            const userA = await new User(dummyUsers[0]).save();
            await new Profile({ user: userA.id }).save();
            const userB = await new User(dummyUsers[1]).save();
            await new Profile({ user: userB.id, following: [userA.id] }).save();

            JWT_TOKEN = await generateJwtToken(userB.id);

            const res = await chai.request(server)
                .post(`${API_URL}/follow/${userA.id}`)
                .set('x-auth-token', JWT_TOKEN);

            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors[0].should.have.property('msg', 'You have already followed that profile');
        });

        it('should POST and update both profiles', async function() {
            const userA = await new User(dummyUsers[0]).save();
            await new Profile({ user: userA.id }).save();
            const userB = await new User(dummyUsers[1]).save();
            await new Profile({ user: userB.id }).save();

            JWT_TOKEN = await generateJwtToken(userB.id);

            const res = await chai.request(server)
                .post(`${API_URL}/follow/${userA.id}`)
                .set('x-auth-token', JWT_TOKEN);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('following');
            res.body.following.should.be.a('array');
            res.body.following.length.should.be.eql(1);
            res.body.following[0].should.be.eql(userA.id);

            const updatedProfileA = await Profile.findOne({ user: userA.id });
            const updatedProfileB = await Profile.findOne({ user: userB.id });

            updatedProfileA.followers.length.should.eql(1);
            updatedProfileA.followers[0].should.eql(userB._id);

            updatedProfileB.following.length.should.eql(1);
            updatedProfileB.following[0].should.eql(userA._id);
        });
    });

    // Unfollow user
    describe('POST /api/profiles/unfollow/:user_id', function() {
        const objectId = generateMongoObjectId();

        it('should not POST when token not provided', async function() {
            const res = await chai.request(server)
                .post(`${API_URL}/unfollow/${objectId}`);

            testNoTokenError(res);
        });

        it('should not POST when trying to unfollow own profile', async function() {
            const user = await new User(dummyUser).save();

            JWT_TOKEN = await generateJwtToken(user.id);

            const res = await chai.request(server)
                .post(`${API_URL}/unfollow/${user.id}`)
                .set('x-auth-token', JWT_TOKEN);

            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors[0].should.have.property('msg', 'You cannot unfollow your own profile');
        });

        it('should POST and update both profiles', async function() {
            const userA = await new User(dummyUsers[0]).save();
            await new Profile({ user: userA.id }).save();
            const userB = await new User(dummyUsers[1]).save();
            await new Profile({ user: userB.id, following: [userA.id] }).save();

            JWT_TOKEN = await generateJwtToken(userB.id);

            const res = await chai.request(server)
                .post(`${API_URL}/unfollow/${userA.id}`)
                .set('x-auth-token', JWT_TOKEN);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('following');
            res.body.following.should.be.a('array');
            res.body.following.length.should.be.eql(0);

            const updatedProfileA = await Profile.findOne({ user: userA.id });
            const updatedProfileB = await Profile.findOne({ user: userB.id });

            updatedProfileA.followers.length.should.eql(0);
            updatedProfileB.following.length.should.eql(0);
        });
    });

    function testNotFoundProfile(res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.be.a('array');
        res.body.errors[0].should.have.property('msg', 'Profile does not exists');
    }

   function testBasicProfile(res, profileId, user) {
       res.should.have.status(200);
       res.body.should.be.a('object');
       res.body.should.have.property('following');
       res.body.following.should.be.a('array');
       res.body.should.have.property('followers');
       res.body.followers.should.be.a('array');
       res.body.should.have.property('likes');
       res.body.likes.should.be.a('array');
       res.body.should.have.property('tweets');
       res.body.tweets.should.be.a('array');
       res.body.should.have.property('homepageTweets');
       res.body.homepageTweets.should.be.a('array');
       res.body.should.have.property('_id', profileId);
       res.body.should.have.property('user');
       res.body.user.should.be.a('object');
       res.body.user.should.have.property('_id', user.id);
       res.body.user.should.have.property('name', user.name);
       res.body.user.should.have.property('username', user.username);
   }
});