// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
// Require the dev-dependencies
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
// Configure chai
chai.should();
chai.use(chaiHttp);

const server = require('../app');
// Require models
const User = require('../models/User');
const Profile = require('../models/Profile');
const Tweet = require('../models/Tweet');

const API_URL = '/api/tweets';
let JWT_TOKEN = null;

const { dummyUser, dummyUsers, dummyTweet } = require('./fixtures/dummy_data');

const charLengthForProps = require('../helpers/charLengthForProps');
const generateJwtToken = require('../helpers/generateJwtToken');
const generateMongoObjectId = require('../helpers/generateMongoObjectId');
const { testNoTokenError, testPopulatedUserObject } = require('./helpers');

describe('Tweets', function() {
    const mongoObjectId = generateMongoObjectId();

    beforeEach(async function() {
        await User.deleteMany({});
        await Profile.deleteMany({});
        await Tweet.deleteMany({});
    });

    /*
        GET all tweets
        Public
     */
    describe('GET /api/tweets/all', function() {
        it('should get all tweets', async function() {
            const res = await chai.request(server)
                .get(`${API_URL}/all`);

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
        });
    });
    /*
        GET all tweets posted by the user with user ID
        Public
     */
    describe('GET /api/tweets/all/:user_id', function() {
        it('should not GET when user does not exists', async function() {
            const res = await chai.request(server)
                .get(`${API_URL}/all/${mongoObjectId}`);

            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors[0].should.have.property('msg', 'User does not exists');
        });

        it('should GET user tweets', async function() {
            const user = await new User(dummyUser).save();

            const res = await chai.request(server)
                .get(`${API_URL}/all/${user.id}`);

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
        });
    });
    /*
        GET all profile's homepageTweets
        Private
     */
    describe('GET /api/tweets/homepageTweets', function() {
        it('should not GET when no token provided', async function() {
            const res = await chai.request(server)
                .get(`${API_URL}/homepageTweets`);

            testNoTokenError(res);
        });

        it('should GET tweets', async function() {
            const user = await new User(dummyUser).save();
            await new Profile({ user: user.id }).save();

            JWT_TOKEN = await generateJwtToken(user.id);

            const res = await chai.request(server)
                .get(`${API_URL}/homepageTweets`)
                .set('x-auth-token', JWT_TOKEN);

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
        });
    });
    /*
        GET tweet by tweet ID
        Public
     */
    describe('GET /api/tweets/:tweet_id', function() {
        it('should not GET when tweet does not exists', async function() {
           const res = await chai.request(server)
               .get(`${API_URL}/${mongoObjectId}`);

            testNotExistsTweet(res);
        });

        it('should GET a tweet by the given id', async function() {
           const user = await new User(dummyUser).save();
           const tweet = await new Tweet({ user: user.id, ...dummyTweet }).save();

            const res = await chai.request(server)
                .get(`${API_URL}/${tweet.id}`);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('text', dummyTweet.text);
            testPopulatedUserObject(res.body, user);
        });
    });

    /*
        POST a tweet
        Private
     */
    describe('POST /api/tweets', function() {
        let user;
        beforeEach(async function() {
            user = await new User(dummyUser).save();
            await new Profile({ user: user.id }).save();
            JWT_TOKEN = await generateJwtToken(user.id);
        });

        it('should not POST when text field is not provided', async function() {
            const res = await chai.request(server)
                .post(`${API_URL}`)
                .set('x-auth-token', JWT_TOKEN);

            testErrorRes(res);
            res.body.errors.length.should.eql(1);
            res.body.errors[0].should.have.property('msg', 'Text field is required');
        });

        it('should not POST when text length is not valid', async function() {
            const res = await chai.request(server)
                .post(`${API_URL}`)
                .set('x-auth-token', JWT_TOKEN)
                .send({ text: 't' });

            testErrorRes(res);
            res.body.errors.length.should.eql(1);
            res.body.errors[0].should.have.property('msg', `Text field must be between ${charLengthForProps.tweet.min} and ${charLengthForProps.tweet.max} chars`);
        });

        it('should not POST when media field is provided but the value is invalid', async function() {
            const res = await chai.request(server)
                .post(`${API_URL}`)
                .set('x-auth-token', JWT_TOKEN)
                .send({ text: 'test', media: 'test' });

            testErrorRes(res);
            res.body.errors.length.should.eql(1);
            res.body.errors[0].should.have.property('msg', 'The media must be a URL');
        });

        it('should POST a tweet', async function() {
            const res = await chai.request(server)
                .post(`${API_URL}`)
                .set('x-auth-token', JWT_TOKEN)
                .send(dummyTweet);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('text', dummyTweet.text);
            res.body.should.have.property('media', dummyTweet.media);
            testPopulatedUserObject(res.body, user);
        });
    });
    /*
        Update tweet
        Private
     */
    describe('PUT /api/tweets/:tweet_id', function() {
        let user;
        let tweet;

        beforeEach(async function() {
            user = await new User(dummyUser).save();
            await new Profile({ user: user.id }).save();
            JWT_TOKEN = await generateJwtToken(user.id);
            tweet = await new Tweet({ user: user.id, ...dummyTweet }).save();
        });

        it('should not POST when text field is not provided', async function() {
            const res = await chai.request(server)
                .put(`${API_URL}/${tweet.id}`)
                .set('x-auth-token', JWT_TOKEN);

            testErrorRes(res);
            res.body.errors.length.should.eql(1);
            res.body.errors[0].should.have.property('msg', 'Text field is required');
        });

        it('should not POST when text length is not valid', async function() {
            const res = await chai.request(server)
                .put(`${API_URL}/${tweet.id}`)
                .set('x-auth-token', JWT_TOKEN)
                .send({ text: 't' });

            testErrorRes(res);
            res.body.errors.length.should.eql(1);
            res.body.errors[0].should.have.property('msg', `Text field must be between ${charLengthForProps.tweet.min} and ${charLengthForProps.tweet.max} chars`);
        });

        it('should not POST when media field is provided but the value is invalid', async function() {
            const res = await chai.request(server)
                .put(`${API_URL}/${tweet.id}`)
                .set('x-auth-token', JWT_TOKEN)
                .send({ text: 'test', media: 'test' });

            testErrorRes(res);
            res.body.errors.length.should.eql(1);
            res.body.errors[0].should.have.property('msg', 'The media must be a URL');
        });

        it('should PUT a tweet', async function() {
            const res = await chai.request(server)
                .put(`${API_URL}/${tweet.id}`)
                .set('x-auth-token', JWT_TOKEN)
                .send({ text: 'Updated ' + dummyTweet.text });

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('text', 'Updated ' + dummyTweet.text);
            testPopulatedUserObject(res.body, user);
        });
    });
    /*
        DELETE a tweet
        Private
     */
    describe('DELETE /api/tweets/:tweet_id', function() {
        let user;
        let tweet;

        beforeEach(async function() {
            user = await new User(dummyUser).save();
            await new Profile({ user: user.id }).save();
            JWT_TOKEN = await generateJwtToken(user.id);
            tweet = await new Tweet({ user: user.id, ...dummyTweet }).save();
        });

        it('should not DELETE if tweet does not exists', async function() {
            const res = await chai.request(server)
                .delete(`${API_URL}/${mongoObjectId}`)
                .set('x-auth-token', JWT_TOKEN);

            testNotExistsTweet(res);
        });

        it('should not DELETE if token is not provided', async function() {
            const res = await chai.request(server)
                .delete(`${API_URL}/${tweet.id}`);

            testNoTokenError(res);
        });

        it('should not DELETE if user is not allowed to do that', async function() {
            const newUser = await new User(dummyUsers[1]).save();
            const newTweet = await new Tweet({ user: newUser.id, ...dummyTweet }).save();

            const res = await chai.request(server)
                .delete(`${API_URL}/${newTweet.id}`)
                .set('x-auth-token', JWT_TOKEN);

            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors[0].should.have.property('msg', 'You are not allowed to delete that tweet');
        });
    });

    /*
        GET a list of profile likes (tweet IDs)
        Public
     */
    describe('GET /like/:user_id', function() {
        it('should not GET if user does not exists', async function() {
            const res = await chai.request(server)
                .get(`${API_URL}/like/${mongoObjectId}`);

            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors[0].should.have.property('msg', 'Profile does not exists');
        });


        it('should get list of likes', async function() {
            const user = await new User(dummyUser).save();
            await new Profile({ user: user.id }).save();

            const res = await chai.request(server)
                .get(`${API_URL}/like/${user.id}`);

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.eql(0);
        });
    });

    /*
        Like or unlike tweet
        Private
     */
    describe('POST /like/:tweet_id', function() {
        let user;
        let tweet;

        beforeEach(async function() {
            user = await new User(dummyUser).save();
            await new Profile({ user: user.id }).save();
            JWT_TOKEN = await generateJwtToken(user.id);
            tweet = await new Tweet({ user: user.id, ...dummyTweet }).save();
        });

        it('should not POST if token not provided', async function() {
            const res = await chai.request(server)
                .post(`${API_URL}/like/${tweet.id}`);

            testNoTokenError(res);
        });

        it('should not POST if tweet does not exists', async function() {
            const res = await chai.request(server)
                .post(`${API_URL}/like/${mongoObjectId}`)
                .set('x-auth-token', JWT_TOKEN);

            testNotExistsTweet(res);
        });

        it('should POST and like a tweet', async function() {
            const res = await chai.request(server)
                .post(`${API_URL}/like/${tweet.id}`)
                .set('x-auth-token', JWT_TOKEN);

            res.should.have.status(200);

            const updatedTweet = await Tweet.findById(tweet.id);
            updatedTweet.likes.should.be.a('array');
            updatedTweet.likes.length.should.be.eql(1);
            updatedTweet.likes[0].should.be.eql(user._id);
        });

        it('should POST and unlike a tweet', async function() {
            const likeRes = await chai.request(server)
                .post(`${API_URL}/like/${tweet.id}`)
                .set('x-auth-token', JWT_TOKEN);

            likeRes.should.have.status(200);

            const unlikeRes = await chai.request(server)
                .post(`${API_URL}/like/${tweet.id}`)
                .set('x-auth-token', JWT_TOKEN);

            unlikeRes.should.have.status(200);
            const updatedTweet = await Tweet.findById(tweet.id);
            updatedTweet.likes.should.be.a('array');
            updatedTweet.likes.length.should.be.eql(0);
        });
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