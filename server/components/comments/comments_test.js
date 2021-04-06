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
const TweetComment = require('../models/TweetComment');

const API_URL = '/api/comments';
let JWT_TOKEN = null;

const { dummyUser, dummyUsers, dummyTweet } = require('./fixtures/dummy_data');

const charLengthForProps = require('../helpers/charLengthForProps');
const generateJwtToken = require('../helpers/generateJwtToken');
const { testNoTokenError, testPopulatedUserObject } = require('./helpers');

describe('Comments', function () {
  beforeEach(async function () {
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Tweet.deleteMany({});
    await TweetComment.deleteMany({});
  });

  /*
        GET all tweet comments
        Public
     */
  describe('GET /api/comments/:tweet_id', function () {
    it('should get all tweet comments', async function () {
      const user = await new User(dummyUser).save();
      const tweet = await new Tweet({ user: user.id, ...dummyTweet }).save();

      const res = await chai.request(server).get(`${API_URL}/${tweet.id}`);

      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(0);
    });
  });

  /*
        POST a comment
        Private
     */
  describe('POST /api/comments/:tweet_id', function () {
    let user;
    let tweet;
    beforeEach(async function () {
      user = await new User(dummyUser).save();
      await new Profile({ user: user.id }).save();
      JWT_TOKEN = await generateJwtToken(user.id);
      tweet = await new Tweet({ user: user.id, ...dummyTweet }).save();
    });

    it('should not POST if token not provided', async function () {
      const res = await chai.request(server).post(`${API_URL}/${tweet.id}`);

      testNoTokenError(res);
    });

    it('should not POST when text field is not provided', async function () {
      const res = await chai
        .request(server)
        .post(`${API_URL}/${tweet.id}`)
        .set('x-auth-token', JWT_TOKEN);

      testErrorRes(res);
      res.body.errors.length.should.eql(1);
      res.body.errors[0].should.have.property('msg', 'Text field is required');
    });

    it('should not POST when text length is not valid', async function () {
      const res = await chai
        .request(server)
        .post(`${API_URL}/${tweet.id}`)
        .set('x-auth-token', JWT_TOKEN)
        .send({ text: 't' });

      testErrorRes(res);
      res.body.errors.length.should.eql(1);
      res.body.errors[0].should.have.property(
        'msg',
        `Text field must be between ${charLengthForProps.tweet.min} and ${charLengthForProps.tweet.max} chars`
      );
    });

    it('should not POST when media field is provided but the value is invalid', async function () {
      const res = await chai
        .request(server)
        .post(`${API_URL}/${tweet.id}`)
        .set('x-auth-token', JWT_TOKEN)
        .send({ text: 'test', media: 'test' });

      testErrorRes(res);
      res.body.errors.length.should.eql(1);
      res.body.errors[0].should.have.property('msg', 'The media must be a URL');
    });

    it('should POST - add a comment', async function () {
      const res = await chai
        .request(server)
        .post(`${API_URL}/${tweet.id}`)
        .set('x-auth-token', JWT_TOKEN)
        .send(dummyTweet);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('text', dummyTweet.text);
      res.body.should.have.property('media', dummyTweet.media);
      res.body.should.have.property('user');
      res.body.should.have.property('tweet', tweet._id.toString());
      testPopulatedUserObject(res.body, user);
    });
  });

  describe('DELETE /comment/:comment_id', function () {
    let user;
    let tweet;
    let comment;
    beforeEach(async function () {
      user = await new User(dummyUser).save();
      await new Profile({ user: user.id }).save();
      JWT_TOKEN = await generateJwtToken(user.id);
      tweet = await new Tweet({ user: user.id, ...dummyTweet }).save();
      comment = await new TweetComment({
        user: user.id,
        tweet: tweet._id,
        ...dummyTweet,
      }).save();
    });

    it('should not remove a comment if user is not the owner', async function () {
      const user2 = await new User(dummyUsers[1]).save();
      JWT_TOKEN = await generateJwtToken(user2.id);

      const res = await chai
        .request(server)
        .delete(`${API_URL}/comment/${comment._id}`)
        .set('x-auth-token', JWT_TOKEN);

      res.should.have.status(401);
      res.body.errors.length.should.eql(1);
      res.body.errors[0].should.have.property(
        'msg',
        'You are not allowed to delete that comment'
      );
    });

    it('should remove a comment', async function () {
      const res = await chai
        .request(server)
        .delete(`${API_URL}/comment/${comment._id}`)
        .set('x-auth-token', JWT_TOKEN);

      res.should.have.status(200);
    });
  });

  /*
        POST /like/:comment_id - like or unlike the comment
        Private
     */
  describe('POST /like/:comment_id', function () {
    let user;
    let tweet;
    let comment;

    beforeEach(async function () {
      user = await new User(dummyUser).save();
      await new Profile({ user: user.id }).save();
      JWT_TOKEN = await generateJwtToken(user.id);
      tweet = await new Tweet({ user: user.id, ...dummyTweet }).save();
      comment = await new TweetComment({
        user: user.id,
        tweet: tweet._id,
        ...dummyTweet,
      }).save();
    });

    it('should like the comment if not liked yet', async function () {
      const res = await chai
        .request(server)
        .post(`${API_URL}/like/${comment._id}`)
        .set('x-auth-token', JWT_TOKEN);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('likes');
      res.body.likes.should.be.a('array');
      res.body.likes.length.should.eql(1);
      res.body.likes[0].should.eql(user.id);
    });

    it('should unlike the comment if already liked', async function () {
      await chai
        .request(server)
        .post(`${API_URL}/like/${comment._id}`)
        .set('x-auth-token', JWT_TOKEN);

      const res = await chai
        .request(server)
        .post(`${API_URL}/like/${comment._id}`)
        .set('x-auth-token', JWT_TOKEN);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('likes');
      res.body.likes.should.be.a('array');
      res.body.likes.length.should.eql(0);
    });
  });

  function testErrorRes(res) {
    res.should.have.status(422);
    res.body.should.be.a('object');
    res.body.should.have.property('errors');
    res.body.errors.should.be.a('array');
  }
});
