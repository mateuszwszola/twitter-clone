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

const { dummyUser } = require('./dummy_data');

describe('Users', function() {
    beforeEach(function() {
        return new Promise(async (resolve, reject) => {
            try {
                await User.deleteMany({});
                await Profile.deleteMany({});
                resolve();
            } catch(err) {
                reject(err);
            }
        });
    });

    describe('/GET /users', function() {
        it('should GET all the users', function(done) {
            chai.request(server)
                .get(API_URL)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(0);
                        done();
                    }
                });
        });
    });

    describe('/GET /users/:user_id', function() {
        it('should GET a user by the given user_id', function() {
            return new Promise(async (resolve, reject) => {
                try {
                    const user = await new User(dummyUser).save();

                    chai.request(server)
                        .get(`${API_URL}/${user.id}`)
                        .end((err, res) => {
                            if (err) {
                                reject(err);
                            } else {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('name', user.name);
                                res.body.should.have.property('username', user.username);
                                res.body.should.have.property('email', user.email);
                                res.body.should.have.property('_id', user.id);
                                resolve();
                            }
                    });
                } catch(err) {
                    reject(err);
                }
            });
        });
    });

    describe('/POST /users/register', function() {
        it('should not POST a register and return errors when not sending any data', function(done) {
            chai.request(server)
                .post(`${API_URL}/register`)
                .end((err, res) => {
                    testRegisterErrorRes(res);
                    testRegisterRequiredErrors(res.body.errors);
                    done();
                });
        });

        it('should not POST a register and return errors when given empty fields', function(done) {
            const body = {
                username: "",
                name: "",
                email: "",
                password: "",
                password2: ""
            };
            registerRequestWithContent(body, (err, res) => {
                if (err) {
                    done(err);
                } else {
                    testRegisterErrorRes(res);
                    testRegisterRequiredErrors(res.body.errors);
                    done();
                }
            });
        });

        it('should not POST a register and return error for invalid name length', function(done) {
            const body = {
                "name": "m"
            };

            registerRequestWithContent(body, (err, res) => {
                if (err) {
                    done(err);
                } else {
                    testRegisterErrorRes(res);
                    const errors = res.body.errors;
                    errors[0].should.have.property('msg', 'The name must be between 2 and 30 chars');
                    done();
                }
            })
        });

        it('should not POST a register and return error for invalid email', function(done) {
            const body = {
                ...dummyUser,
                email: "johndoe"
            };

            registerRequestWithContent(body, (err, res) => {
                if (err) {
                    done(err);
                } else {
                    testRegisterErrorRes(res);
                    const errors = res.body.errors;
                    errors[0].should.have.property('msg', 'invalid email');
                    done();
                }
            })
        });

        it('should not POST a register and return error for invalid password length', function(done) {
            const body = {
                ...dummyUser,
                password: "123"
            };

            registerRequestWithContent(body, (err, res) => {
                if (err) {
                    done(err);
                } else {
                    testRegisterErrorRes(res);
                    const errors = res.body.errors;
                    errors[0].should.have.property('msg', 'The password must be between 6 and 30 chars');
                    done();
                }
            });
        });

        it('should not POST and return error for password not match', function(done) {
           const body = {
               ...dummyUser,
               password: "123456",
               password2: "1234567"
           };

           registerRequestWithContent(body, (err, res) => {
               if (err) {
                   done(err);
               } else {
                   testRegisterErrorRes(res);
                   const errors = res.body.errors;
                   errors[0].should.have.property('msg', 'password confirmation does not match password');
                   done();
               }
           });
        });

        it('should POST a register and return the token', function(done) {
            registerRequestWithContent(dummyUser, (err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                }
            });
        });

        it('should not POST and return errors for username and email already in use',function() {
            return new Promise(async (resolve, reject) => {
                try {
                    const user = await new User(dummyUser).save();

                    registerRequestWithContent(user, (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            testRegisterErrorRes(res);
                            const errors = res.body.errors;
                            errors[0].should.have.property('msg', 'username already in use');
                            errors[1].should.have.property('msg', 'e-mail already in use');
                            resolve();
                        }
                    });
                } catch(err) {
                    reject(err);
                }
            });
        });

        it('should not POST and return error for invalid avatar', function(done) {
            const body = {
                ...dummyUser,
                avatar: 'johndoe'
            };

            registerRequestWithContent(body, (err, res) => {
                if (err) {
                    done(err);
                } else {
                    testRegisterErrorRes(res);
                    const errors = res.body.errors;
                    errors[0].should.have.property('msg', 'avatar must be a valid URL');
                    done();
                }
            });
        });

        function registerRequestWithContent(body, cb) {
            chai.request(server)
                .post(`${API_URL}/register`)
                .set('content-type', 'application/json')
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

    describe('/POST /users/login', function() {
        it('should not POST a login without username and password fields', function(done) {
            chai.request(server)
                .post(`${API_URL}/login`)
                .set('content-type', 'application/json')
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        testLoginErrorRes(res, 422);
                        res.body.errors[0].should.have.property('msg', 'username is required');
                        res.body.errors[1].should.have.property('msg', 'password is required');
                        done();
                    }
                });
        });

       it('should not POST a login with empty username and password', function(done) {
           const body = {
               username: "",
               password: ""
           };

           loginRequestWithContent(body, (err, res) => {
               if (err) {
                   done(err);
               } else {
                   testLoginErrorRes(res, 422);
                   res.body.errors[0].should.have.property('msg', 'username is required');
                   res.body.errors[1].should.have.property('msg', 'password is required');
                   done();
               }
           });
       });

       it('should not POST a login with credentials for user which does not exists', function(done) {
            const body = {
                username: dummyUser.username,
                password: dummyUser.password
            };

            loginRequestWithContent(body, (err, res) => {
                if (err) {
                    done(err);
                } else {
                   testLoginErrorRes(res, 400);
                   res.body.errors[0].should.have.property('msg', 'Incorrect username and password combination');
                   done();
                }
            });
       });

       it('should not POST a login with invalid credentials', function() {
           return new Promise(async (resolve, reject) => {
               try {
                   const user = await new User(dummyUser).save();

                   loginRequestWithContent({ username: user.username, password: "123" }, (err, res) => {
                       if (err) {
                           reject(err);
                       } else {
                           testLoginErrorRes(res, 400);
                           res.body.errors[0].should.have.property('msg', 'Incorrect username and password combination');
                           resolve();
                       }
                   });
               } catch(err) {
                   reject(err);
               }
           });
       });

       it('should POST a login and return token', function() {
            return new Promise(async (resolve, reject) => {
                try {
                    let user = await new User(dummyUser);
                    user.password = await generateHashPassword(user.password);
                    await user.save();

                    chai.request(server)
                        .post(`${API_URL}/login`)
                        .set('content-type', 'application/json')
                        .send(JSON.stringify({ username: user.username, password: dummyUser.password }))
                        .end((err, res) => {
                            if (err) {
                                reject(err);
                            } else {
                               res.should.have.status(200);
                               res.body.should.be.a('object');
                               res.body.should.have.property('token');
                               resolve();
                            }
                        });
                } catch(err) {
                    reject(err);
                }
            });
       });

       function loginRequestWithContent(body, cb) {
           chai.request(server)
               .post(`${API_URL}/login`)
               .set('content-type', 'application/json')
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

    describe('/GET /users/current', function() {
        it('should not GET current user and return error for lack of jwt token', function(done) {
            chai.request(server)
                .get(`${API_URL}/current`)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        testNoTokenError(res);
                        done();
                    }
                });
        });

       it('should GET current user with the given jwt token', function() {
           return new Promise(async (resolve, reject) => {
              try {
               const user = await new User(dummyUser).save();

               JWT_TOKEN = await generateJwtToken(user.id);

               chai.request(server)
                   .get(`${API_URL}/current`)
                   .set('x-auth-token', JWT_TOKEN)
                   .end((err, res) => {
                       if (err) {
                           reject(err);
                       } else {
                           res.should.have.status(200);
                           res.body.should.be.a('object');
                           res.body.should.have.property('username', dummyUser.username);
                           res.body.should.have.property('email', dummyUser.email);
                           res.body.should.have.property('name', dummyUser.name);
                           resolve();
                       }
                   });

              } catch(err) {
                  reject(err);
              }
           });
       });
    });
});