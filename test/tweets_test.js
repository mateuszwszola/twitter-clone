'use strict';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const server = require('../app');
// Configure chai
chai.use(chaiHttp);
chai.should();
// Require models
const User = require('../models/User');
const Profile = require('../models/Profile');
const Tweet = require('../models/Tweet');

const BASIC_URL = '/api/tweets';
let JWT_TOKEN = null;

const { dummyUser, dummyUsers, dummyTweet } = require('./dummy_data');

const charLengthForProps = require('../helpers/charLengthForProps');
const generateJwtToken = require('../helpers/generateJwtToken');
const generateMongoObjectId = require('../helpers/generateMongoObjectId');
const { testNoTokenError, testPopulatedUserObject } = require('./helpers');

describe('Tweets', () => {
    beforeEach(() => {
        return new Promise(async resolve => {
            await User.deleteMany({});
            await Profile.deleteMany({});
            await Tweet.deleteMany({});
            resolve();
        });
    });
    /*
        GET all tweets
        Public
     */
    describe('/GET /api/tweets/all', () => {
        it('it should get all tweets', (done) => {
            chai.request(server)
                .get(`${BASIC_URL}/all`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
    /*
        GET all tweets posted by the user with user ID
        Public
     */
    describe('/GET /api/tweets/all/:user_id', () => {
        it('it should not GET when user does not exists', (done) => {
            const objectId = generateMongoObjectId();
            chai.request(server)
                .get(`${BASIC_URL}/all/${objectId}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors[0].should.have.property('msg', 'User does not exists');
                    done();
                });
        });

        it('it should GET user tweets', async () => {
            const user = await new User(dummyUser).save();

            return new Promise(resolve => {
                chai.request(server)
                    .get(`${BASIC_URL}/all/${user.id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(0);
                        resolve();
                    });
            });
        });
    });
    /*
        GET all profile's homepageTweets
        Private
     */
    describe('/GET /api/tweets/homepageTweets', () => {
        it('it should not GET when no token provided', (done) => {
            chai.request(server)
                .get(`${BASIC_URL}/homepageTweets`)
                .end((err, res) => {
                   testNoTokenError(res);
                   done();
                });
        });
        it('it should GET tweets', async () => {
            const user = await new User(dummyUser).save();
            await new Profile({ user: user.id }).save();

            JWT_TOKEN = await generateJwtToken(user.id);

            return new Promise(resolve => {
               chai.request(server)
                   .get(`${BASIC_URL}/homepageTweets`)
                   .set('x-auth-token', JWT_TOKEN)
                   .end((err, res) => {
                       res.should.have.status(200);
                       res.body.should.be.a('array');
                       res.body.length.should.be.eql(0);
                       resolve();
                   });
            });
        });
    });
    /*
        GET tweet by tweet ID
        Public
     */
    describe('/GET /api/tweets/:tweet_id', () => {
        it('it should not GET when tweet does not exists', (done) => {
            const objectId = generateMongoObjectId();
           chai.request(server)
               .get(`${BASIC_URL}/${objectId}`)
               .end((err, res) => {
                    testNotExistsTweet(res);
                    done();
               });
        });
        it('it should GET a tweet by the given id', async () => {
           const user = await new User(dummyUser).save();
           const tweet = await new Tweet({ user: user.id, ...dummyTweet }).save();

           return new Promise(resolve => {
              chai.request(server)
                  .get(`${BASIC_URL}/${tweet.id}`)
                  .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     res.body.should.have.property('text', dummyTweet.text);
                     testPopulatedUserObject(res.body, user);
                     resolve();
                  });
           });
        });
    });
    /*
        POST a tweet
        Private
     */
    describe('/POST /api/tweets', () => {
        it('it should not POST when text field is not provided', async () => {
            const user = await new User(dummyUser).save();
            JWT_TOKEN = await generateJwtToken(user.id);

            return new Promise(resolve => {
                chai.request(server)
                    .post(`${BASIC_URL}`)
                    .set('x-auth-token', JWT_TOKEN)
                    .end((err, res) => {
                       testErrorRes(res);
                       res.body.errors.length.should.eql(1);
                       res.body.errors[0].should.have.property('msg', 'Text field is required');
                       resolve();
                    });
            });
        });
        it('it should not POST when text length is not valid', async () => {
            const user = await new User(dummyUser).save();
            JWT_TOKEN = await generateJwtToken(user.id);

            return new Promise(resolve => {
                chai.request(server)
                    .post(`${BASIC_URL}`)
                    .set('x-auth-token', JWT_TOKEN)
                    .send({ text: 't' })
                    .end((err, res) => {
                        testErrorRes(res);
                        res.body.errors.length.should.eql(1);
                        res.body.errors[0].should.have.property('msg', `Text field must be between ${charLengthForProps.tweet.min} and ${charLengthForProps.tweet.max} chars`);
                        resolve();
                    });
            });
        });
        it('it should not POST when media field is provided but the value is invalid', async () => {
            const user = await new User(dummyUser).save();
            JWT_TOKEN = await generateJwtToken(user.id);

            return new Promise(resolve => {
                chai.request(server)
                    .post(`${BASIC_URL}`)
                    .set('x-auth-token', JWT_TOKEN)
                    .send({ text: 'test', media: 'test' })
                    .end((err, res) => {
                        testErrorRes(res);
                        res.body.errors.length.should.eql(1);
                        res.body.errors[0].should.have.property('msg', 'The media must be a URL');
                        resolve();
                    });
            });
        });
        it('it should POST a tweet', async () => {
            const user = await new User(dummyUser).save();
            await new Profile({ user: user.id }).save();
            JWT_TOKEN = await generateJwtToken(user.id);

            return new Promise(resolve => {
                chai.request(server)
                    .post(`${BASIC_URL}`)
                    .set('x-auth-token', JWT_TOKEN)
                    .send(dummyTweet)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('text', dummyTweet.text);
                        res.body.should.have.property('media', dummyTweet.media);
                        testPopulatedUserObject(res.body, user);
                        resolve();
                    });
            });
        });
    });
    /*
        Update tweet
        Private
     */
    describe('/PUT /api/tweets/:tweet_id', () => {

    });
    /*
        DELETE a tweet
        Private
     */
    describe('/DELETE /api/tweets/:tweet_id', () => {

    });

    function testErrorRes(res) {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.be.a('array');
    }

    function testNotExistsTweet(res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.be.a('array');
        res.body.errors[0].should.have.property('msg', 'Tweet does not exists');
    }
});