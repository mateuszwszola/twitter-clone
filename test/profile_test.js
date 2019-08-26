'use strict';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
// Require the dev-dependencies
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../app');
chai.use(chaiHttp);
// Require models
const User = require('../models/User');
const Profile = require('../models/Profile');

const BASIC_URL = '/api/profiles';
let JWT_TOKEN = null;

const { dummyUser, dummyUsers } = require('./dummy_data');

const generateJwtToken = require('../helpers/generateJwtToken');
const { testNoTokenError } = require('./helpers');

describe('Profiles', () => {
   beforeEach((done) => {
       User.deleteMany({}, (err) => {
           Profile.deleteMany({}, (err) => {
               done();
           }) ;
       });
   });

   describe('/GET /api/profiles', () => {
       it('it should not GET logged in user and return error for lack of jwt token', async () => {
           return new Promise(resolve => {
               chai.request(server)
                   .get(BASIC_URL)
                   .end((err, res) => {
                        testNoTokenError(res);
                        resolve();
                   });
           });
       });

       it('it should GET logged in user profile', async () => {
           const user = await new User(dummyUser).save();
           const profile = await new Profile({ user: user.id }).save();

           JWT_TOKEN = await generateJwtToken(user.id);

           return new Promise(resolve => {
               chai.request(server)
                   .get(BASIC_URL)
                   .set('x-auth-token', JWT_TOKEN)
                   .end((err, res) => {
                       testBasicProfile(res, profile.id, user);
                       resolve();
                   });

           });
       });
   });

   describe('/GET /api/profiles/all', () => {
      it('it should GET all the profiles', async () => {
          return new Promise(resolve => {
              chai.request(server)
                  .get(`${BASIC_URL}/all`)
                  .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('array');
                     res.body.length.should.be.eql(0);
                     resolve();
                  });
          });
      });
   });

   describe('/GET /api/profiles/:user_id', () => {
       it('it should not GET and return error when profile does not exists', async () => {
           let user = new User(dummyUser);
           user = await user.save();

           return new Promise(resolve => {
               chai.request(server)
                   .get(`${BASIC_URL}/${user.id}`)
                   .end((err, res) => {
                       testNotFoundProfile(res);
                       resolve();
                   });
           });
       });

       it('it should not GET and return error when user_id is invalid id', async () => {
           return new Promise(resolve => {
              chai.request(server)
                  .get(`${BASIC_URL}/123`)
                  .end((err, res) => {
                      testNotFoundProfile(res);
                      resolve();
                  });
           });
       });

       it('it should GET and return profile for user_id', async () => {
            const user = await new User(dummyUser).save();
            const profile = await new Profile({ user: user.id }).save();

            return new Promise(resolve => {
                chai.request(server)
                    .get(`${BASIC_URL}/${user.id}`)
                    .end((err, res) => {
                        testBasicProfile(res, profile.id, user);
                        resolve();
                    });
            });
       });
   });

   describe('/GET /api/profiles/username/:username', () => {
        it('it should not GET a profile when user with that username does not exists', async () => {
           return new Promise(resolve => {
               chai.request(server)
                   .get(`${BASIC_URL}/username/${dummyUser.username}`)
                   .end((err, res) => {
                       res.should.have.status(404);
                       res.body.should.be.a('object');
                       res.body.should.have.property('errors');
                       res.body.errors.should.be.a('array');
                       res.body.errors[0].should.have.property('msg', 'User with that username does not exists');
                       resolve();
                   });
           });
        });

        it('it should GET a profile', async () => {
            const user = await new User(dummyUser).save();
            const profile = await new Profile({ user: user.id }).save();

            return new Promise(resolve => {
                chai.request(server)
                    .get(`${BASIC_URL}/username/${user.username}`)
                    .end((err, res) => {
                        testBasicProfile(res, profile.id, user);
                        resolve();
                    });
            });
        });
   });

   describe('/POST /api/profiles', () => {
        it('it should POST and update the profile', async () => {
            const user = await new User(dummyUser).save();
            const profile = await new Profile({ user: user.id }).save();

            JWT_TOKEN = await generateJwtToken(user.id);

            const body = {
                bio: `My name is ${dummyUser.name}`,
                location: 'New York City',
                website: `${dummyUser.username}.com`
            };

            return new Promise(resolve => {
                chai.request(server)
                    .post(`${BASIC_URL}`)
                    .set('x-auth-token', JWT_TOKEN)
                    .send(body)
                    .end((err, res) => {
                        testBasicProfile(res, profile.id, user);
                        res.body.should.have.property('bio', body.bio);
                        res.body.should.have.property('location', body.location);
                        res.body.should.have.property('website', body.website);
                        resolve();
                    });
            });
        });
        it('it should POST and update the profile by resetting some fields', async () => {
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

            return new Promise(resolve => {
                chai.request(server)
                    .post(`${BASIC_URL}`)
                    .set('x-auth-token', JWT_TOKEN)
                    .send(body)
                    .end((err, res) => {
                        testBasicProfile(res, profile.id, user);
                        res.body.should.have.property('bio', '');
                        res.body.should.have.property('location', '');
                        res.body.should.have.property('website', '');
                        resolve();
                    });
            });
        });
        it('it should not POST when given username is already in use', async () => {
            await new User(dummyUsers[0]).save();
            const user = await new User(dummyUsers[1]);
            await new Profile({ user: user.id }).save();

            JWT_TOKEN = await generateJwtToken(user.id);

            return new Promise(resolve => {
                chai.request(server)
                    .post(`${BASIC_URL}`)
                    .set('x-auth-token', JWT_TOKEN)
                    .send({ username: dummyUsers[0].username })
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                        res.body.errors.should.be.a('array');
                        res.body.errors[0].should.have.property('msg', 'username already in use');
                        resolve();
                    });
            });

        });
        it('it should not POST when trying to reset name and username', async () => {
            const user = await new User(dummyUser).save();
            await new Profile({ user: user.id }).save();

            JWT_TOKEN = await generateJwtToken(user.id);

            return new Promise(resolve => {
               chai.request(server)
                   .post(`${BASIC_URL}`)
                   .set('x-auth-token', JWT_TOKEN)
                   .send({ username: '', name: '' })
                   .end((err, res) => {
                       res.should.have.status(422);
                       res.body.should.be.a('object');
                       res.body.should.have.property('errors');
                       res.body.errors.should.be.a('array');
                       res.body.errors.length.should.be.eql(2);
                       resolve();
                   });
            });
        });
   });

   describe('/DELETE /api/profiles', () => {
       it('it should not DELETE account when no token provided', async () => {
           return new Promise(resolve => {
               chai.request(server)
                   .delete(`${BASIC_URL}`)
                   .end((err, res) => {
                       testNoTokenError(res);
                       resolve();
                   });
           });
       });
       it('it should DELETE account and return success message', async () => {
           const user = await new User(dummyUser).save();
           await new Profile({ user: user.id }).save();

           JWT_TOKEN = await generateJwtToken(user.id);

           return new Promise(resolve => {
               chai.request(server)
                   .delete(`${BASIC_URL}`)
                   .set('x-auth-token', JWT_TOKEN)
                   .end((err, res) => {
                       res.should.have.status(200);
                       res.body.should.be.a('object');
                       res.body.should.have.property('message', 'Success');
                       resolve();
                   });
           });
       });
   });

    function testNotFoundProfile(res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.be.a('array');
        res.body.errors[0].should.have.property('msg', 'Profile not found');
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