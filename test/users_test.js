// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
// Require the dev-dependencies
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

const server = require('../app');
// Require models
const User = require('../models/User');
const Profile = require('../models/Profile');

const API_URL = '/api/users';
let JWT_TOKEN = null;

const generateJwtToken = require('../helpers/generateJwtToken');
const generateHashPassword = require('../helpers/generateHashPassword');
const { testNoTokenError } = require('./helpers');

const { dummyUser } = require('./fixtures/dummy_data');

describe('Users', function() {
    beforeEach(async function() {
        await User.deleteMany({});
        await Profile.deleteMany({});
    });

    describe('GET /users', function() {
        it('should GET all the users', async function() {
            const res = await chai.request(server)
                .get(API_URL);

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
        });
    });

    describe('GET /users/:user_id', function() {
        it('should GET a user by the given user_id', async function() {
            const user = await new User(dummyUser).save();

            const res = await chai.request(server)
                .get(`${API_URL}/${user.id}`);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name', user.name);
            res.body.should.have.property('username', user.username);
            res.body.should.have.property('email', user.email);
            res.body.should.have.property('_id', user.id);
        });
    });

    describe('POST /users/register', function() {
        it('should not POST a register and return errors when not sending any data', async function() {
            const res = await chai.request(server)
                .post(`${API_URL}/register`);

            testRegisterErrorRes(res);
            testRegisterRequiredErrors(res.body.errors);
        });

        it('should not POST a register and return errors when given empty fields', async function() {
            const body = {
                username: "",
                name: "",
                email: "",
                password: "",
                password2: ""
            };

            const res = await registerRequestWithContent(body);
            testRegisterErrorRes(res);
            testRegisterRequiredErrors(res.body.errors);
        });

        it('should not POST a register and return error for invalid name length', async function() {
            const body = {
                name: "m"
            };

            const res = await registerRequestWithContent(body);

            testRegisterErrorRes(res);
            res.body.errors[0].should.have.property('msg', 'The name must be between 2 and 30 chars');
        });

        it('should not POST a register and return error for invalid email', async function() {
            const body = {
                ...dummyUser,
                email: "johndoe"
            };

            const res = await registerRequestWithContent(body);

            testRegisterErrorRes(res);
            res.body.errors[0].should.have.property('msg', 'invalid email');
        });

        it('should not POST a register and return error for invalid password length', async function() {
            const body = {
                ...dummyUser,
                password: "123"
            };

            const res = await registerRequestWithContent(body);

            testRegisterErrorRes(res);
            res.body.errors[0].should.have.property('msg', 'The password must be between 6 and 30 chars');
        });

        it('should not POST and return error for password not match', async function() {
           const body = {
               ...dummyUser,
               password: "123456",
               password2: "1234567"
           };

           const res = await registerRequestWithContent(body);

            testRegisterErrorRes(res);
            res.body.errors[0].should.have.property('msg', 'password confirmation does not match password');
        });

        it('should POST a register and return the token', async function() {
            const res = await registerRequestWithContent(dummyUser);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
        });

        it('should not POST and return errors for username and email already in use',async function() {
            await new User(dummyUser).save();

            const res = await registerRequestWithContent(dummyUser);

            testRegisterErrorRes(res);
            const errors = res.body.errors;
            errors[0].should.have.property('msg', 'username already in use');
            errors[1].should.have.property('msg', 'e-mail already in use');
        });

        it('should not POST and return error for invalid avatar', async function() {
            const body = {
                ...dummyUser,
                avatar: 'johndoe'
            };

            const res = await registerRequestWithContent(body);

            testRegisterErrorRes(res);
            res.body.errors[0].should.have.property('msg', 'avatar must be a valid URL');
        });

        function registerRequestWithContent(body) {
            return chai.request(server)
                .post(`${API_URL}/register`)
                .set('content-type', 'application/json')
                .send(body);
        }

        function testRegisterErrorRes(res) {
            res.should.have.status(422);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
        }

        function testRegisterRequiredErrors(errors) {
            errors[0].should.have.property('msg', 'name is required');
            errors[1].should.have.property('msg', 'username is required');
            errors[2].should.have.property('msg', 'email is required');
            errors[3].should.have.property('msg', 'password is required');
            errors[4].should.have.property('msg', 'confirmation password is required');
        }
    });

    describe('POST /users/login', function() {
        it('should not POST a login without username and password fields', async function() {
            const res  = await chai.request(server)
                .post(`${API_URL}/login`)
                .set('content-type', 'application/json');

            testLoginErrorRes(res, 422);
            res.body.errors[0].should.have.property('msg', 'username is required');
            res.body.errors[1].should.have.property('msg', 'password is required');
        });

       it('should not POST a login with empty username and password', async function() {
           const body = {
               username: "",
               password: ""
           };

           const res = await loginRequestWithContent(body);

           testLoginErrorRes(res, 422);
           res.body.errors[0].should.have.property('msg', 'username is required');
           res.body.errors[1].should.have.property('msg', 'password is required');
       });

       it('should not POST a login with credentials for user which does not exists', async function() {
            const body = {
                username: dummyUser.username,
                password: dummyUser.password
            };

            const res = await loginRequestWithContent(body);

           testLoginErrorRes(res, 400);
           res.body.errors[0].should.have.property('msg', 'Incorrect username and password combination');
       });

       it('should not POST a login with invalid credentials', async function() {
           const user = await new User(dummyUser).save();

           const res = await loginRequestWithContent({ username: user.username, password: "123" });

           testLoginErrorRes(res, 400);
           res.body.errors[0].should.have.property('msg', 'Incorrect username and password combination');
       });

       it('should POST a login and return token', async function() {
           let user = await new User(dummyUser);
           user.password = await generateHashPassword(user.password);
           await user.save();

           const res = await chai.request(server)
               .post(`${API_URL}/login`)
               .set('content-type', 'application/json')
               .send({ username: user.username, password: dummyUser.password });

           res.should.have.status(200);
           res.body.should.be.a('object');
           res.body.should.have.property('token');
       });

       function loginRequestWithContent(body) {
           return chai.request(server)
               .post(`${API_URL}/login`)
               .set('content-type', 'application/json')
               .send(body);
       }

       function testLoginErrorRes(res, statusCode) {
           res.should.have.status(statusCode);
           res.body.should.be.a('object');
           res.body.should.have.property('errors');
           res.body.errors.should.be.a('array');
       }
    });

    describe('GET /users/current', function() {
        it('should not GET current user and return error for lack of jwt token', async function() {
            const res = await chai.request(server)
                .get(`${API_URL}/current`);

            testNoTokenError(res);
        });

       it('should GET current user with the given jwt token', async function() {
           const user = await new User(dummyUser).save();

           JWT_TOKEN = await generateJwtToken(user.id);

           const res = await chai.request(server)
               .get(`${API_URL}/current`)
               .set('x-auth-token', JWT_TOKEN);

           res.should.have.status(200);
           res.body.should.be.a('object');
           res.body.should.have.property('username', dummyUser.username);
           res.body.should.have.property('email', dummyUser.email);
           res.body.should.have.property('name', dummyUser.name);
       });
    });
});