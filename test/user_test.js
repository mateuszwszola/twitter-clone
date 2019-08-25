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

const BASIC_URL = '/api/users';
let JWT_TOKEN = null;

const generateJwtToken = require('../helpers/generateJwtToken');
const generateHashPassword = require('../helpers/generateHashPassword');

const { dummyUser } = require('./dummy_data');

describe('Users', () => {
    beforeEach((done) => {
        User.deleteMany({}, (err) => {
           Profile.deleteMany({}, (err) => {
                done();
           }) ;
        });
    });

    describe('/GET /users', () => {
        it('it should GET all the users', done => {
            chai.request(server)
                .get(BASIC_URL)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/GET /users/:user_id', () => {
        it('it should GET a user by the given user_id', (done) => {
            const user = new User(dummyUser);
            user.save((err, user) => {
                chai.request(server)
                    .get(`${BASIC_URL}/${user.id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name');
                        res.body.should.have.property('username');
                        res.body.should.have.property('email');
                        res.body.should.have.property('_id', user.id);
                        done();
                    });
            });
        });
    });

    describe('/POST /users/register', () => {
        it('it should not POST a register and return errors when not sending any data', (done) => {
            chai.request(server)
                .post(`${BASIC_URL}/register`)
                .end((err, res) => {
                    testRegisterErrorRes(res);
                    testRegisterRequiredErrors(res.body.errors);
                    done();
                });
        });

        it('it should not POST a register and return errors when given empty fields', (done) => {
            const body = {
                username: "",
                name: "",
                email: "",
                password: "",
                password2: ""
            };
            registerRequestWithContent(body, (err, res) => {
                testRegisterErrorRes(res);
                testRegisterRequiredErrors(res.body.errors);
                done();
            });
        });

        it('it should not POST a register and return error for invalid name length', (done) => {
            const body = {
                "name": "m"
            };

            registerRequestWithContent(body, (err, res) => {
                testRegisterErrorRes(res);
                const errors = res.body.errors;
                errors[0].should.have.property('msg', 'The name must be between 2 and 30 chars');
                done();
            })
        });

        it('it should not POST a register and return error for invalid email', (done) => {
            const body = {
                ...dummyUser,
                email: "johndoe"
            };

            registerRequestWithContent(body, (err, res) => {
                testRegisterErrorRes(res);
                const errors = res.body.errors;
                errors[0].should.have.property('msg', 'invalid email');
                done();
            })
        });

        it('it should not POST a register and return error for invalid password length', (done) => {
            const body = {
                ...dummyUser,
                password: "123"
            };

            registerRequestWithContent(body, (err, res) => {
                testRegisterErrorRes(res);
                const errors = res.body.errors;
                errors[0].should.have.property('msg', 'The password must be between 6 and 30 chars');
                done();
            })

        });

        it('it should not POST and return error for password not match', (done) => {
           const body = {
               ...dummyUser,
               password: "123456",
               password2: "1234567"
           };

           registerRequestWithContent(body, (err, res) => {
               testRegisterErrorRes(res);
               const errors = res.body.errors;
               errors[0].should.have.property('msg', 'password confirmation does not match password');
               done();
           });
        });

        it('it should POST a register and return the token', (done) => {
            registerRequestWithContent(dummyUser, (err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                done();
            });
        });

        it('it should not POST and return errors for username and email already in use',(done) => {
            const user = new User(dummyUser);
            user.save((err, user) => {
                registerRequestWithContent(user, (err, res) => {
                    testRegisterErrorRes(res);
                    const errors = res.body.errors;
                    errors[0].should.have.property('msg', 'username already in use');
                    errors[1].should.have.property('msg', 'e-mail already in use');
                    done();
                });
            })
        });

        it('it should not POST and return error for invalid avatar', (done) => {
            const body = {
                ...dummyUser,
                avatar: 'johndoe'
            };

            registerRequestWithContent(body, (err, res) => {
                testRegisterErrorRes(res);
               const errors = res.body.errors;
               errors[0].should.have.property('msg', 'avatar must be a valid URL');
               done();
            });
        });

        function registerRequestWithContent(body, cb) {
            chai.request(server)
                .post(`${BASIC_URL}/register`)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(body))
                .end(cb);
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

    describe('/POST /users/login', () => {
        it('it should not POST a login without username and password fields', (done) => {
            chai.request(server)
                .post(`${BASIC_URL}/login`)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    testLoginErrorRes(res, 422);
                    res.body.errors[0].should.have.property('msg', 'username is required');
                    res.body.errors[1].should.have.property('msg', 'password is required');
                    done();
                });
        });

       it('it should not POST a login with empty username and password', (done) => {
           const body = {
               username: "",
               password: ""
           };

           loginRequestWithContent(body, (err, res) => {
               testLoginErrorRes(res, 422);
               res.body.errors[0].should.have.property('msg', 'username is required');
               res.body.errors[1].should.have.property('msg', 'password is required');
               done();
           });
       });

       it('it should not POST a login with credentials for user which does not exists', (done) => {
            const body = {
                username: dummyUser.username,
                password: dummyUser.password
            };

            loginRequestWithContent(body, (err, res) => {
               testLoginErrorRes(res, 400);
               res.body.errors[0].should.have.property('msg', 'Incorrect username and password combination');
               done();
            });
       });

       it('it should not POST a login with invalid credentials', (done) => {
           const user = new User({
               username: dummyUser.username,
               password: dummyUser.password
           });

           user.save((err, user) => {
               loginRequestWithContent({ username: dummyUser.username, password: "123" }, (err, res) => {
                   testLoginErrorRes(res, 400);
                   res.body.errors[0].should.have.property('msg', 'Incorrect username and password combination');
                   done();
               });
           });
       });

       it('it should POST a login and return token', async () => {
            const user = new User(dummyUser);
            user.password = await generateHashPassword(user.password);

            return new Promise(resolve => {
                user.save((err, user) => {
                   loginRequestWithContent({ username: user.username, password: dummyUser.password }, (err, res) => {
                         res.should.have.status(200);
                         res.body.should.be.a('object');
                         res.body.should.have.property('token');
                         resolve();
                   });
                });
            })
       });

       function loginRequestWithContent(body, cb) {
           chai.request(server)
               .post(`${BASIC_URL}/login`)
               .set('Content-Type', 'application/json')
               .send(JSON.stringify(body))
               .end(cb);
       }

       function testLoginErrorRes(res, statusCode) {
           res.should.have.status(statusCode);
           res.body.should.be.a('object');
           res.body.should.have.property('errors');
           res.body.errors.should.be.a('array');
       }
    });

    describe('/GET /users/current', () => {
       it('it should GET current user with the given jwt token', async () => {
           let user = new User(dummyUser);
           user = await user.save();

           JWT_TOKEN = await generateJwtToken(user.id);

           return new Promise(resolve => {
               chai.request(server)
                   .get(`${BASIC_URL}/current`)
                   .set('x-auth-token', JWT_TOKEN)
                   .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('username', dummyUser.username);
                      res.body.should.have.property('email', dummyUser.email);
                      res.body.should.have.property('name', dummyUser.name);
                      resolve();
                   });
           });
       });
    });
});